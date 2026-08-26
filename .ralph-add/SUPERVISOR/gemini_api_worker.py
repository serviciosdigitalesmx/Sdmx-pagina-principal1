#!/usr/bin/env python3
"""Native Google Gemini/Gemma worker with bounded tools for Ralph sandboxes."""

from __future__ import annotations

import argparse
import fnmatch
import json
import multiprocessing
import os
from pathlib import Path
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request


DEFAULT_MODEL = "gemma-4-26b-a4b-it"
DEFAULT_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta"
POOL_FILE = Path.home() / ".config" / "ralph-hotel" / "provider-pool.json"
SECRET_PARTS = {".env", ".env.local", ".env.production", ".env.development"}
FORBIDDEN_COMMANDS = (
    "git reset", "git clean", "git checkout", "git restore", "rm -rf",
    "drop table", "truncate ", "delete from", "flyway clean", "docker compose down",
    "kubectl delete", "curl ", "wget ", "security ", "openrouter.ai",
)
SAFE_COMMAND_PREFIXES = (
    "git diff --check", "git status", "git diff", "git log", "rg ", "rg --files",
    "npm ", "npm run ", "npm --prefix ", "pnpm ", "pnpm --filter ",
    "pnpm --dir ", "pnpm exec ", "python -m pytest", "python3 -m pytest",
    "pytest ", "./gradlew ", "gradle ", "./mvnw ", "mvn ",
    "docker compose config", "docker compose ps",
)


def fail(message: str) -> dict:
    return {"ok": False, "error": message}


def is_secret_path(rel: str) -> bool:
    parts = Path(rel).parts
    return any(part in SECRET_PARTS or part.startswith(".env.") for part in parts) or any(
        part.lower().endswith(('.pem', '.key', '.p12', '.jks')) for part in parts
    )


def resolve_path(root: Path, raw: str) -> tuple[Path | None, str | None]:
    candidate = (root / raw).resolve()
    try:
        rel = candidate.relative_to(root).as_posix()
    except ValueError:
        return None, "path escapes sandbox"
    if is_secret_path(rel):
        return None, "secret-like path is blocked"
    return candidate, None


def path_allowed(rel: str, allowed_paths: list[str]) -> bool:
    for raw in allowed_paths:
        pattern = raw.strip().lstrip("./").rstrip("/")
        if not pattern:
            continue
        if fnmatch.fnmatch(rel, pattern) or rel == pattern or rel.startswith(pattern + "/"):
            return True
        if pattern.endswith("/**") and rel.startswith(pattern[:-3].rstrip("/") + "/"):
            return True
    return False


def read_file(root: Path, raw: str) -> dict:
    path, error = resolve_path(root, raw)
    if error:
        return fail(error)
    if not path or not path.is_file():
        return fail("file not found")
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
        limit = 120_000
        return {"ok": True, "path": path.relative_to(root).as_posix(), "content": text[:limit], "truncated": len(text) > limit}
    except OSError as exc:
        return fail(f"read failed: {exc}")


def list_files(root: Path, raw: str) -> dict:
    path, error = resolve_path(root, raw or ".")
    if error:
        return fail(error)
    if not path or not path.is_dir():
        return fail("directory not found")
    items = []
    for child in sorted(path.iterdir()):
        rel = child.relative_to(root).as_posix()
        if child.name in {".git", ".ralph-add", "node_modules", ".next", "dist", "build", "coverage"}:
            continue
        if is_secret_path(rel):
            continue
        items.append({"path": rel, "kind": "dir" if child.is_dir() else "file"})
    return {"ok": True, "items": items[:300]}


def search_text(root: Path, pattern: str, raw: str) -> dict:
    path, error = resolve_path(root, raw or ".")
    if error:
        return fail(error)
    if not path:
        return fail("invalid search path")
    command = ["rg", "--no-heading", "--line-number", "--hidden", "-g", "!.git", "-g", "!node_modules", "-g", "!.next", "-g", "!.env*", pattern, str(path)]
    try:
        result = subprocess.run(command, cwd=root, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=20)
        return {"ok": True, "matches": result.stdout[-40_000:]}
    except (OSError, subprocess.TimeoutExpired) as exc:
        return fail(f"search failed: {exc}")


def apply_patch(root: Path, patch: str, allowed_paths: list[str]) -> dict:
    if not patch.strip():
        return fail("empty patch")
    paths = []
    for line in patch.splitlines():
        if line.startswith("+++ ") or line.startswith("--- "):
            raw_path = line[4:].strip().split("\t", 1)[0]
            if raw_path.startswith(("a/", "b/")):
                raw_path = raw_path[2:]
            paths.append(raw_path)
    if not paths:
        return fail("patch must contain unified diff paths")
    for rel in paths:
        if rel == "/dev/null":
            continue
        if is_secret_path(rel) or not path_allowed(rel, allowed_paths):
            return fail(f"patch path is outside allowed_paths: {rel}")
    try:
        check = subprocess.run(["git", "apply", "--check", "--whitespace=nowarn", "--unsafe-paths", "-"], cwd=root, input=patch, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=20)
        if check.returncode != 0:
            return fail(f"patch check failed: {check.stdout[-4000:]}")
        applied = subprocess.run(["git", "apply", "--whitespace=nowarn", "--unsafe-paths", "-"], cwd=root, input=patch, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=20)
        if applied.returncode != 0:
            return fail(f"patch apply failed: {applied.stdout[-4000:]}")
        return {"ok": True, "changed_paths": sorted(set(paths))}
    except (OSError, subprocess.TimeoutExpired) as exc:
        return fail(f"patch execution failed: {exc}")


def run_command(root: Path, command: str, verify_commands: list[str]) -> dict:
    normalized = command.strip()
    lower = normalized.lower()
    if not normalized or any(fragment in lower for fragment in FORBIDDEN_COMMANDS):
        return fail("command blocked by worker policy")
    if not any(normalized == allowed or normalized.startswith(prefix) for allowed in verify_commands for prefix in (allowed,)) and not any(normalized.startswith(prefix) for prefix in SAFE_COMMAND_PREFIXES):
        return fail("command is not an allowed validation command")
    try:
        result = subprocess.run(normalized, cwd=root, shell=True, executable="/bin/zsh", text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=900)
        return {"ok": result.returncode == 0, "exit_code": result.returncode, "output": result.stdout[-20_000:]}
    except subprocess.TimeoutExpired:
        return fail("command timed out")


def key_services() -> list[str]:
    raw = os.environ.get("RALPH_GEMINI_KEY_SERVICES", "")
    if raw:
        return [item.strip() for item in raw.split(",") if item.strip()]
    try:
        data = json.loads(POOL_FILE.read_text(encoding="utf-8"))
        slots = data.get("gemini", {}).get("slots", [])
        if slots:
            return [str(slot) for slot in slots]
    except (OSError, json.JSONDecodeError, AttributeError):
        pass
    return [f"ralph-hotel-gemini-{index:02d}" for index in range(1, 8)]


def load_keys() -> list[str]:
    user = os.environ.get("USER", "")
    keys = []
    for service in key_services():
        try:
            result = subprocess.run(["security", "find-generic-password", "-a", user, "-s", service, "-w"], text=True, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=3)
        except (OSError, subprocess.TimeoutExpired):
            continue
        if result.returncode == 0 and result.stdout.strip():
            keys.append(result.stdout.strip())
    if not keys:
        raise RuntimeError("no Gemini/OpenRouter credentials available in macOS Keychain")
    return keys


def _api_request_once(key: str, endpoint: str, model: str, body: bytes, connection: object) -> None:
    url = f"{endpoint}/models/{urllib.parse.quote(model, safe='')}:generateContent?key={urllib.parse.quote(key, safe='')}"
    request = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.loads(response.read().decode("utf-8"))
        connection.send({"ok": True, "payload": payload})
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[-1000:]
        connection.send({"ok": False, "kind": "http", "code": exc.code, "detail": detail})
    except (OSError, TimeoutError, json.JSONDecodeError) as exc:
        connection.send({"ok": False, "kind": "error", "detail": str(exc)})


def _api_worker_loop(key: str, endpoint: str, connection: object) -> None:
    """Keep one isolated process and one Keychain credential per API slot."""
    try:
        while True:
            try:
                job = connection.recv()
            except EOFError:
                return
            if job is None:
                return
            _api_request_once(key, endpoint, str(job["model"]), job["body"], connection)
    finally:
        connection.close()


class GeminiApiPool:
    """A patient seven-process pool, with one process dedicated to each key."""

    def __init__(self, keys: list[str], endpoint: str):
        self.context = multiprocessing.get_context("spawn")
        self.keys = keys
        self.endpoint = endpoint
        self.connections: list[object] = []
        self.processes: list[multiprocessing.Process] = []
        self.next_index = 0
        for index in range(len(keys)):
            self._start(index)

    def _start(self, index: int) -> None:
        parent, child = self.context.Pipe()
        process = self.context.Process(
            target=_api_worker_loop,
            args=(self.keys[index], self.endpoint, child),
            name=f"ralph-gemini-api-{index + 1:02d}",
        )
        process.start()
        child.close()
        if index == len(self.connections):
            self.connections.append(parent)
            self.processes.append(process)
        else:
            self.connections[index] = parent
            self.processes[index] = process

    def restart(self, index: int) -> None:
        process = self.processes[index]
        if process.is_alive():
            process.terminate()
        process.join(2)
        self.connections[index].close()
        self._start(index)

    def request(self, index: int, model: str, body: bytes, timeout: int) -> dict:
        connection = self.connections[index]
        if not self.processes[index].is_alive():
            self.restart(index)
            connection = self.connections[index]
        connection.send({"model": model, "body": body})
        if not connection.poll(timeout):
            self.restart(index)
            return {"ok": False, "kind": "timeout", "detail": f"Gemini API slot {index + 1} exceeded {timeout}s"}
        try:
            return connection.recv()
        except (EOFError, OSError) as exc:
            self.restart(index)
            return {"ok": False, "kind": "error", "detail": str(exc)}

    def close(self) -> None:
        for connection in self.connections:
            try:
                connection.send(None)
            except (OSError, BrokenPipeError):
                pass
        for process in self.processes:
            process.join(2)
            if process.is_alive():
                process.terminate()
                process.join(2)
        for connection in self.connections:
            connection.close()


def call_api(
    messages: list[dict],
    tools: list[dict],
    model: str,
    pool: GeminiApiPool,
    *,
    json_mode: bool = False,
) -> tuple[dict, str]:
    max_output_tokens = max(1024, int(os.environ.get("RALPH_GEMINI_MAX_OUTPUT_TOKENS", "2048")))
    generation_config = {
        "temperature": 0.1,
        "maxOutputTokens": max_output_tokens,
    }
    if json_mode:
        generation_config["responseMimeType"] = "application/json"
    payload = {
        "contents": messages,
        "generationConfig": generation_config,
    }
    if tools:
        payload["tools"] = [{"function_declarations": tools}]
    body = json.dumps(payload).encode("utf-8")
    last_error = "request failed"
    request_timeout = max(15, int(os.environ.get("RALPH_GEMINI_API_TIMEOUT_SECONDS", "60")))

    for offset in range(len(pool.keys)):
        index = (pool.next_index + offset) % len(pool.keys)
        result = pool.request(index, model, body, request_timeout)
        if result.get("ok"):
            pool.next_index = (index + 1) % len(pool.keys)
            return result["payload"], pool.keys[index]
        if result.get("kind") == "http":
            code = int(result.get("code", 0))
            last_error = f"HTTP {code}: {result.get('detail', '')}"
            if code not in (401, 402, 408, 429, 500, 502, 503, 504):
                break
        else:
            last_error = str(result.get("detail", "request failed"))
    raise RuntimeError(last_error)


def tool_definitions() -> list[dict]:
    return [
        {"name": "list_files", "description": "List non-secret files and directories in the isolated sandbox.", "parameters": {"type": "OBJECT", "properties": {"path": {"type": "STRING"}}, "required": ["path"]}},
        {"name": "read_file", "description": "Read a source file from the isolated sandbox. Never use for secrets.", "parameters": {"type": "OBJECT", "properties": {"path": {"type": "STRING"}}, "required": ["path"]}},
        {"name": "search_text", "description": "Search source text with ripgrep inside the isolated sandbox.", "parameters": {"type": "OBJECT", "properties": {"pattern": {"type": "STRING"}, "path": {"type": "STRING"}}, "required": ["pattern", "path"]}},
        {"name": "apply_patch", "description": "Apply a unified diff only to the A.SPEC allowed paths.", "parameters": {"type": "OBJECT", "properties": {"patch": {"type": "STRING"}}, "required": ["patch"]}},
        {"name": "run_command", "description": "Run a safe, targeted validation command from the A.SPEC.", "parameters": {"type": "OBJECT", "properties": {"command": {"type": "STRING"}}, "required": ["command"]}},
    ]


def read_only_tool_definitions() -> list[dict]:
    """Tools allowed to the planner; planning can inspect, never edit or execute."""
    return tool_definitions()[:3]


def execute(prompt: str, root: Path, mode: str, allowed_paths: list[str], verify_commands: list[str]) -> dict:
    model = os.environ.get("RALPH_GEMINI_API_MODEL", DEFAULT_MODEL)
    if mode == "plan":
        os.environ.setdefault("RALPH_GEMINI_MAX_OUTPUT_TOKENS", "8192")
    keys = load_keys()
    endpoint = os.environ.get("RALPH_GEMINI_API_URL", DEFAULT_ENDPOINT).rstrip("/")
    pool = GeminiApiPool(keys, endpoint)
    tools = tool_definitions() if mode == "write" else []
    messages = [{"role": "user", "parts": [{"text": prompt}]}]
    tool_calls = 0
    max_turns = max(1, int(os.environ.get("RALPH_GEMINI_MAX_TURNS", "12")))
    repeated_errors: dict[str, int] = {}
    try:
        for _turn in range(max_turns):
            response, _key = call_api(
                messages,
                tools,
                model,
                pool,
                json_mode=mode == "plan",
            )
            candidate = (response.get("candidates") or [{}])[0]
            content = candidate.get("content") or {}
            parts = content.get("parts") or []
            calls = [part.get("functionCall") for part in parts if part.get("functionCall")]
            if not calls:
                answer = "\n".join(str(part.get("text", "")) for part in parts if part.get("text"))
                return {"response": answer.strip(), "model": model, "tool_calls": tool_calls}
            messages.append({"role": "model", "parts": parts})
            for call in calls:
                tool_calls += 1
                name = call.get("name")
                try:
                    arguments = call.get("args") or {}
                    if isinstance(arguments, str):
                        arguments = json.loads(arguments)
                except (TypeError, json.JSONDecodeError):
                    result = fail("invalid tool arguments")
                else:
                    if name == "list_files":
                        result = list_files(root, str(arguments.get("path", ".")))
                    elif name == "read_file":
                        result = read_file(root, str(arguments.get("path", "")))
                    elif name == "search_text":
                        result = search_text(root, str(arguments.get("pattern", "")), str(arguments.get("path", ".")))
                    elif name == "apply_patch":
                        result = apply_patch(root, str(arguments.get("patch", "")), allowed_paths)
                    elif name == "run_command":
                        result = run_command(root, str(arguments.get("command", "")), verify_commands)
                    else:
                        result = fail(f"unknown tool: {name}")
                function_response = {"name": name, "response": result}
                if call.get("id"):
                    function_response["id"] = call["id"]
                if not result.get("ok", False):
                    error_key = json.dumps(result, sort_keys=True, ensure_ascii=False)
                    repeated_errors[error_key] = repeated_errors.get(error_key, 0) + 1
                    if repeated_errors[error_key] >= 3:
                        raise RuntimeError("same tool error repeated three times; worker stopped safely")
                messages.append({"role": "user", "parts": [{"functionResponse": function_response}]})
        raise RuntimeError(f"tool-call turn limit reached ({max_turns})")
    finally:
        pool.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sandbox", required=True)
    parser.add_argument("--mode", choices=["plan", "write"], default="write")
    parser.add_argument("--allowed-path", action="append", default=[])
    parser.add_argument("--verify-command", action="append", default=[])
    parser.add_argument("--prompt", required=True)
    args = parser.parse_args()
    try:
        result = execute(args.prompt, Path(args.sandbox).resolve(), args.mode, args.allowed_path, args.verify_command)
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc), "model": os.environ.get("RALPH_GEMINI_API_MODEL", DEFAULT_MODEL)}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
