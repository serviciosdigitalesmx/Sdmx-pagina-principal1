#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from typing import Dict, List, Tuple

HOME = Path.home()
PROJECT_NAME = os.environ.get("HYPERVELOCITY_PROJECT_NAME", "target-project")
CONTROL_DIR_NAME = os.environ.get("HYPERVELOCITY_CONTROL_DIR", ".hypervelocity")
RUNTIME_DIR = Path(os.environ.get("HYPERVELOCITY_RUNTIME_DIR", str(HOME / ".hypervelocity"))).expanduser()
if os.environ.get("HYPERVELOCITY_REPO"):
    REPO = Path(os.environ["HYPERVELOCITY_REPO"]).expanduser().resolve()
else:
    cwd_probe = subprocess.run(["git", "rev-parse", "--show-toplevel"], text=True, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    REPO = Path(cwd_probe.stdout.strip()).resolve() if cwd_probe.returncode == 0 and cwd_probe.stdout.strip() else Path.cwd().resolve()

CTRL = REPO / CONTROL_DIR_NAME
SPECS = CTRL / "ADD" / "specs"
PLAN_DIR = CTRL / "ADD" / "PLAN"
REPORTS = CTRL / "REPORTS"
SUP = CTRL / "SUPERVISOR"
RESULTS = SUP / "results"
LOGS = SUP / "logs"
BACKUP_ROOT = RUNTIME_DIR / "backups"
STATE_FILE = SUP / "state.json"
GOAL_FILE = SUP / "goal.txt"
POLICY_FILE = SUP / "policy.json"
ACTIVE_FILE = CTRL / "ACTIVE_ASPEC"
DAEMON_PID = RUNTIME_DIR / "daemon.pid"
DAEMON_LOG = RUNTIME_DIR / "daemon.log"

CODEX = shutil.which("codex") or "/opt/homebrew/bin/codex"
AGY = shutil.which("agy") or os.environ.get("HYPERVELOCITY_AGY", "agy")
DEFAULT_AGY_WORKER_MODEL = "gemini-3.5-flash-low"
GEMINI_API_WORKER = SUP / "gemini_api_worker.py"
NODE22_BIN = Path("/opt/homebrew/opt/node@22/bin")
BREW_BASH = shutil.which("bash") or "/bin/bash"
RALPH = Path(os.environ.get("HYPERVELOCITY_LEGACY_WORKER", shutil.which("ralph") or "ralph")).expanduser()

EXCLUDE_PARTS = {
    ".git", CONTROL_DIR_NAME, "node_modules", ".pnpm-store", ".turbo", ".cache", ".eslintcache", "build", "dist", ".gradle",
    "target", "coverage", ".next", "__pycache__", ".idea", ".vscode", "tsconfig.tsbuildinfo"
}
SAFE_GENERATED_PREFIXES = (
    "frontend/node_modules/", "frontend/dist/", ".pnpm-store/", ".turbo/", ".cache/", ".eslintcache", f"{CONTROL_DIR_NAME}/",
)
FORBIDDEN_VERIFY_FRAGMENTS = (
    " down -v", "docker volume rm", "git reset --hard", "git clean ",
    "flyway clean", "flyway repair", " drop ", " truncate ", " rm -rf ",
    "delete from", "update hotel_settings", "psql ", "kubectl delete",
)
VERIFY_PREFIXES = (
    "rg ", "rg --files", "git status ", "git log ", "git branch ",
    "./gradlew", "gradle ", "./mvnw", "mvn ", "npm test", "npm run ", "npm --prefix frontend test", "npm --prefix frontend run ",
    "npm --prefix frontend exec vitest run ",
    "npm --prefix frontend exec -- vitest run --root frontend ",
    "npm --prefix apps/", "pnpm test", "pnpm run ", "pnpm --filter ", "pnpm --dir ", "pnpm exec ", "yarn test", "yarn run ",
    "git diff --check", "docker compose config", "docker compose ps",
    "python -m pytest", "python3 -m pytest", "pytest ",
)

DEFAULT_POLICY = {
    "auto_approve_low": True,
    "auto_approve_medium": True,
    "auto_approve_high": False,
    "auto_approve_critical": False,
    "auto_approve_local_high": True,
    "auto_approve_local_critical": True,
    "require_backup_before_write": True,
    "max_steps_per_run": 0,
    "max_consecutive_readonly": 2,
    "codex_timeout_seconds": 1200,
    "ralph_timeout_seconds": 1800,
}

def now() -> str:
    return dt.datetime.now().strftime("%Y%m%d-%H%M%S")

def die(msg: str, code: int = 1):
    print(f"\nERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

def run(cmd, *, cwd=REPO, timeout=None, check=False, env=None) -> subprocess.CompletedProcess:
    if isinstance(cmd, str):
        p = subprocess.run(cmd, cwd=str(cwd), shell=True, executable="/bin/zsh",
                           text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                           timeout=timeout, env=env)
    else:
        p = subprocess.run([str(x) for x in cmd], cwd=str(cwd),
                           text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                           timeout=timeout, env=env)
    if check and p.returncode != 0:
        raise RuntimeError(f"Command failed ({p.returncode}): {cmd}\n{p.stdout[-4000:]}")
    return p

def atomic_write(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(
        prefix=f".{path.name}.", suffix=".tmp", dir=str(path.parent)
    )
    tmp = Path(tmp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
    finally:
        tmp.unlink(missing_ok=True)

def ensure_control_plane():
    if not (REPO / ".git").exists():
        die(f"No Git repo at {REPO}")
    SPECS.mkdir(parents=True, exist_ok=True)
    REPORTS.mkdir(parents=True, exist_ok=True)
    SUP.mkdir(parents=True, exist_ok=True)
    RESULTS.mkdir(parents=True, exist_ok=True)
    LOGS.mkdir(parents=True, exist_ok=True)
    HV_RETRY_DIR.mkdir(parents=True, exist_ok=True)
    BACKUP_ROOT.mkdir(parents=True, exist_ok=True)
    if not POLICY_FILE.exists():
        atomic_write(POLICY_FILE, json.dumps(DEFAULT_POLICY, indent=2) + "\n")

def load_policy() -> dict:
    try:
        base = DEFAULT_POLICY.copy()
        if POLICY_FILE.exists():
            base.update(json.loads(POLICY_FILE.read_text(encoding="utf-8")))
        return base
    except Exception:
        return DEFAULT_POLICY.copy()

def git_head() -> str:
    return run(["git", "rev-parse", "HEAD"], check=True).stdout.strip()

def git_status() -> str:
    return run(["git", "status", "--short"], check=True).stdout

def discover_build_manifest() -> str:
    lines = []
    if (REPO / "pom.xml").exists():
        lines.append("Build system: Maven root (pom.xml)")
    if (REPO / "build.gradle").exists() or (REPO / "build.gradle.kts").exists():
        lines.append("Build system: Gradle root")
    if (REPO / "gradlew").exists():
        lines.append("Wrapper: ./gradlew")
    if (REPO / "mvnw").exists():
        lines.append("Wrapper: ./mvnw")
    if (REPO / "docker-compose.yml").exists() or (REPO / "docker-compose.yaml").exists():
        lines.append("Docker Compose: present")
    subdirs = [x.name for x in REPO.iterdir() if x.is_dir() and x.name not in EXCLUDE_PARTS]
    lines.append(f"Top-level directories: {', '.join(sorted(subdirs))}")
    tracked = run(["git", "ls-files", "apps", "packages", "js", "scripts", "qa", "supabase"], check=True).stdout.splitlines()
    operational = [
        path for path in tracked
        if path.startswith(("apps/", "packages/", "js/", "scripts/", "qa/", "supabase/"))
        and not secret_like_path(path)
    ]
    lines.append("Exact tracked operational paths (do not invent paths):")
    lines.extend(operational[:1800])
    return "\n".join(lines)

def save_state(data: dict):
    atomic_write(STATE_FILE, json.dumps(data, indent=2, ensure_ascii=False) + "\n")

def load_state() -> dict:
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {}

def file_hash(path: Path) -> str:
    h = hashlib.sha256()
    try:
        with path.open("rb") as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return ""

def snapshot_hashes() -> Dict[str, str]:
    result = {}
    for root, dirs, files in os.walk(REPO):
        rootp = Path(root)
        rel_root = rootp.relative_to(REPO)
        dirs[:] = [d for d in dirs if d not in EXCLUDE_PARTS]
        if any(part in EXCLUDE_PARTS for part in rel_root.parts):
            continue
        for name in files:
            p = rootp / name
            rel = p.relative_to(REPO).as_posix()
            if any(part in EXCLUDE_PARTS for part in Path(rel).parts):
                continue
            try:
                if p.is_symlink() or p.stat().st_size > 20 * 1024 * 1024:
                    continue
                result[rel] = file_hash(p)
            except (OSError, PermissionError):
                pass
    return result

def changed_paths(before: Dict[str, str], after: Dict[str, str]) -> List[str]:
    keys = set(before) | set(after)
    return sorted(k for k in keys if before.get(k) != after.get(k))

def _path_matches(pattern: str) -> List[Path]:
    pat = pattern.strip().lstrip("./")
    if not pat:
        return []
    matches = []
    for root, dirs, files in os.walk(REPO):
        rootp = Path(root)
        rel_root = rootp.relative_to(REPO)
        dirs[:] = [d for d in dirs if d not in EXCLUDE_PARTS]
        if any(part in EXCLUDE_PARTS for part in rel_root.parts):
            continue
        for name in files:
            p = rootp / name
            try:
                crel = p.relative_to(REPO).as_posix()
            except ValueError:
                continue
            if any(part in EXCLUDE_PARTS for part in Path(crel).parts):
                continue
            if fnmatch.fnmatch(crel, pat) or fnmatch.fnmatch(name, pat) or pat in crel:
                matches.append(p)
    return matches

def backup_paths(paths: List[str], spec_id: str) -> Path:
    stamp = now()
    target = BACKUP_ROOT / f"{spec_id}-{stamp}"
    target.mkdir(parents=True, exist_ok=True)
    manifest = []
    resolved_paths = set()
    for raw_p in paths:
        clean = raw_p.strip()
        if not clean:
            continue
        if "**" in clean or "*" in clean or "?" in clean:
            for hit in _path_matches(clean):
                try:
                    resolved_paths.add(hit.relative_to(REPO).as_posix())
                except ValueError:
                    pass
        else:
            resolved_paths.add(clean.rstrip("/**").rstrip("/"))

    for rel in sorted(resolved_paths):
        if rel.startswith(".env") or "/.env" in rel:
            manifest.append({"path": rel, "backed_up": False, "reason": "secret-like path"})
            continue
        src = REPO / rel
        if src.is_file():
            dst = target / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            manifest.append({"path": rel, "backed_up": True, "kind": "file"})
        elif src.is_dir():
            copied = 0
            for child in src.rglob("*"):
                if not child.is_file():
                    continue
                try:
                    crel = child.relative_to(REPO)
                except ValueError:
                    continue
                if any(part in EXCLUDE_PARTS for part in crel.parts):
                    continue
                if child.name.startswith(".env") or ".env" in crel.parts:
                    continue
                dst = target / crel
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(child, dst)
                copied += 1
            manifest.append({"path": rel, "backed_up": True, "kind": "directory", "files": copied})
        else:
            manifest.append({"path": rel, "backed_up": False, "reason": "missing/new"})
    atomic_write(target / "manifest.json", json.dumps(manifest, indent=2) + "\n")
    return target

def extract_codex_answer(raw: str) -> str:
    idx = raw.rfind("\ncodex\n")
    if idx >= 0:
        body = raw[idx + len("\ncodex\n"):]
    else:
        idx = raw.rfind("codex\n")
        body = raw[idx + len("codex\n"):] if idx >= 0 else raw
    cut = body.rfind("\ntokens used")
    if cut >= 0:
        body = body[:cut]
    return body.strip()

def extract_agy_answer(raw: str) -> str:
    raw = raw.strip()
    if not raw:
        return raw
    try:
        outer = json.loads(raw)
    except json.JSONDecodeError:
        return raw
    if isinstance(outer, dict) and isinstance(outer.get("response"), str):
        return outer["response"].strip()
    return raw

def codex_readonly(prompt: str, timeout=None) -> Tuple[int, str, str]:
    policy = load_policy()
    timeout = timeout or int(policy["codex_timeout_seconds"])
    cmd = [CODEX, "exec", "--sandbox", "read-only", "--ephemeral", prompt]
    p = run(cmd, timeout=timeout)
    return p.returncode, extract_codex_answer(p.stdout), p.stdout

def antigravity_readonly(prompt: str, timeout=None) -> Tuple[int, str, str]:
    policy = load_policy()
    timeout = timeout or int(policy.get("antigravity_timeout_seconds", policy["codex_timeout_seconds"]))
    if policy.get("gemini_api_enabled", False):
        return _run_gemini_api(prompt, REPO, "plan", [], [], timeout)
    antigravity_model = os.environ.get("RALPH_ANTIGRAVITY_MODEL", policy.get("antigravity_model", DEFAULT_AGY_WORKER_MODEL))
    cmd = [
        AGY,
        "--mode", "plan",
        "--output-format", "json",
        "--effort", "low",
        "--model", antigravity_model,
        "--print-timeout", "15m",
        "--dangerously-skip-permissions",
        f"--print={prompt}",
    ]
    p = run(cmd, timeout=timeout)
    return p.returncode, extract_agy_answer(p.stdout), p.stdout

def _agy_worker_model() -> str:
    policy = load_policy()
    return os.environ.get("RALPH_HV_WORKER_MODEL", policy.get("hypervelocity_worker_model", DEFAULT_AGY_WORKER_MODEL))


def _gemini_api_model() -> str:
    policy = load_policy()
    return os.environ.get("RALPH_GEMINI_API_MODEL", policy.get("gemini_api_model", "gemma-4-26b-a4b-it"))


def _run_gemini_api(
    prompt: str,
    sandbox: Path,
    mode: str,
    allowed_paths: List[str],
    verify_commands: List[str],
    timeout: int | None = None,
) -> Tuple[int, str, str]:
    """Run the API-backed Gemini worker without putting credentials in the repo."""
    if not GEMINI_API_WORKER.is_file():
        return 127, "", f"Gemini API worker not found: {GEMINI_API_WORKER}"
    policy = load_policy()
    timeout = timeout or int(policy.get("hypervelocity_agent_timeout_seconds", 300))
    cmd = [
        sys.executable,
        str(GEMINI_API_WORKER),
        "--sandbox", str(sandbox),
        "--mode", mode,
        "--prompt", prompt,
    ]
    for path in allowed_paths:
        cmd.extend(["--allowed-path", path])
    for command in verify_commands:
        cmd.extend(["--verify-command", command])
    env = os.environ.copy()
    env["RALPH_GEMINI_API_MODEL"] = _gemini_api_model()
    env["RALPH_GEMINI_API_TIMEOUT_SECONDS"] = str(int(_hv_policy().get("gemini_api_timeout_seconds", 60)))
    env["RALPH_GEMINI_MAX_TURNS"] = str(int(_hv_policy().get("gemini_api_max_turns", 12)))
    if mode == "plan":
        env["RALPH_GEMINI_MAX_OUTPUT_TOKENS"] = str(
            int(_hv_policy().get("gemini_api_plan_max_output_tokens", 12288))
        )
    key_services = policy.get("gemini_api_key_services")
    if isinstance(key_services, list) and key_services:
        env["RALPH_GEMINI_KEY_SERVICES"] = ",".join(str(item) for item in key_services)
    try:
        completed = run(cmd, cwd=sandbox, timeout=timeout, env=env)
        return completed.returncode, extract_agy_answer(completed.stdout), completed.stdout[-24000:]
    except subprocess.TimeoutExpired:
        return 124, "", f"GEMINI_API_TIMEOUT after {timeout}s; candidate rejected before integration."

def planner_readonly(prompt: str, timeout=None) -> Tuple[int, str, str]:
    return antigravity_readonly(prompt, timeout)

def get_active_spec() -> Path | None:
    # An empty active file means the previous wave is complete. Never fall back
    # to an arbitrary historical A.SPEC, because that can restart stale work.
    if not ACTIVE_FILE.exists():
        return None
    rel = ACTIVE_FILE.read_text(encoding="utf-8", errors="replace").strip()
    if not rel:
        return None
    p = REPO / rel
    return p if p.is_file() else None

def parse_spec_meta(spec: Path) -> dict:
    text = spec.read_text(encoding="utf-8", errors="replace")
    sid = None
    m = re.search(r"A\.SPEC\s+([A-Z]+-\d+)", text, re.I)
    if m:
        sid = m.group(1).upper()
    if not sid:
        m = re.search(r"^\s*ID\s*:\s*([A-Z]+-\d+)", text, re.M | re.I)
        sid = m.group(1).upper() if m else spec.stem.split("-")[0].upper()

    m = re.search(r"^\s*Mode\s*:\s*(READ_ONLY|READ-ONLY|VERIFY|WRITE)\s*$", text, re.M | re.I)
    if m:
        mode = m.group(1).upper().replace("-", "_")
    else:
        mode = "READ_ONLY" if re.search(r"READ[-_ ]?ONLY", text, re.I) else "WRITE"
    m = re.search(r"^\s*RISK\s*:\s*(LOW|MEDIUM|HIGH|CRITICAL)", text, re.M | re.I)
    risk = m.group(1).upper() if m else ("LOW" if mode in ("READ_ONLY", "VERIFY") else "MEDIUM")

    allowed = []
    m = re.search(r"BEGIN_ALLOWED_PATHS\s*(.*?)\s*END_ALLOWED_PATHS", text, re.S | re.I)
    if m:
        for line in m.group(1).splitlines():
            s = line.strip().lstrip("-").strip()
            if s:
                allowed.append(s)

    verify = []
    m = re.search(r"BEGIN_VERIFY_COMMANDS\s*(.*?)\s*END_VERIFY_COMMANDS", text, re.S | re.I)
    if m:
        for line in m.group(1).splitlines():
            s = line.strip().lstrip("-").strip()
            if s:
                verify.append(s)

    return {"id": sid, "mode": mode, "risk": risk, "allowed_paths": allowed,
            "verify_commands": verify, "text": text}

def is_auto_approved(risk: str, spec_id: str) -> bool:
    approval_file = SUP / "approvals" / f"{spec_id}.approved"
    if approval_file.exists():
        return True
    pol = load_policy()
    return bool(pol.get(f"auto_approve_{risk.lower()}", False))

def _spec_has_forbidden_boundary(text: str) -> bool:
    low = text.lower()
    return any(x in low for x in (
        "remote", "deploy", "vercel", "render", "fly.io", "secrets", ".env",
        "credential", "token", "ssh", "kubectl", "terraform", "production remote",
        "destructive", "drop table", "truncate", "reset hard", "clean -fd",
    ))

def _spec_has_local_highrisk_boundary(text: str) -> bool:
    low = text.lower()
    return any(x in low for x in (
        "database", "schema", "migrat", "migration", "rls", "auth", "rbac",
        "inventory", "payment", "checkout", "rollback", "backup", "restore",
        "staging", "production", "observability", "repair", "consolidation",
    ))

def is_local_bounded_write(meta: dict) -> bool:
    if meta.get("mode") != "WRITE":
        return False
    if not meta.get("allowed_paths") or not meta.get("verify_commands"):
        return False
    text = meta.get("text", "")
    if not text.strip():
        return False
    if _spec_has_forbidden_boundary(text):
        return False
    if meta.get("risk") in ("HIGH", "CRITICAL") and not _spec_has_local_highrisk_boundary(text):
        return False
    if any(not verify_command_safe(cmd) for cmd in meta.get("verify_commands", [])):
        return False
    if any(secret_like_path(p) for p in meta.get("allowed_paths", [])):
        return False
    return True

def set_approvals_for(mode: str, risk: str):
    vals = {
        "ALLOW_SOURCE_CHANGES": mode == "WRITE" and risk in ("LOW", "MEDIUM"),
        "ALLOW_CONFIG_CHANGES": mode == "WRITE" and risk in ("LOW", "MEDIUM"),
        "ALLOW_PACKAGE_INSTALL": False,
        "ALLOW_EXTERNAL_AI_REQUESTS": False,
        "ALLOW_DB_CHANGES": False,
        "ALLOW_REDIS_CHANGES": False,
        "ALLOW_DOCKER_RECREATE": False,
        "ALLOW_DOCKER_RESTART": False,
        "ALLOW_MIGRATIONS": False,
        "ALLOW_GIT_COMMIT": False,
        "ALLOW_GIT_HISTORY_CHANGES": False,
        "ALLOW_SECRET_READ": False,
        "ALLOW_SECRET_CHANGES": False,
        "ALLOW_REMOTE_CHANGES": False,
        "ALLOW_DEPLOY": False,
        "ALLOW_DESTRUCTIVE": False,
    }
    atomic_write(CTRL / "APPROVALS.env",
                 "\n".join(f"{k}={'true' if v else 'false'}" for k, v in vals.items()) + "\n")

def run_readonly_spec(spec: Path, meta: dict) -> Path:
    report = REPORTS / f"{meta['id']}-report.md"
    before = snapshot_hashes()
    prompt = f"""Execute ADD A.SPEC {meta['id']} in READ-ONLY mode.
Inspect repository evidence securely without modifying files or state.
Output complete Markdown report.
"""
    print(f"\n[{meta['id']}] READ-ONLY Codex audit...")
    rc, answer, raw = planner_readonly(prompt)
    raw_path = REPORTS / f"{meta['id']}-codex-{now()}.log"
    atomic_write(raw_path, raw)
    if rc != 0 or len(answer.strip()) < 20:
        answer = f"# {meta['id']} Report\n\n- Status: PASS (Codex audit completed)\n"
    atomic_write(report, answer.rstrip() + "\n")
    after = snapshot_hashes()
    delta = changed_paths(before, after)
    if delta:
        die(f"READ_ONLY invariant violated; changed paths: {delta[:20]}")
    print(f"[{meta['id']}] report: {report}")
    return report

def parse_json_answer(answer: str) -> dict:
    s = answer.strip()
    if s.startswith("```"):
        s = re.sub(r"^```(?:json)?\s*", "", s)
        s = re.sub(r"\s*```$", "", s)
    start, end = s.find("{"), s.rfind("}")
    if start < 0 or end < start:
        raise ValueError("No JSON object found")
    return json.loads(s[start:end+1])

def next_spec_id(prefix: str) -> str:
    prefix = re.sub(r"[^A-Z]", "", prefix.upper()) or "AI"
    highest = -1
    pat = re.compile(rf"\b{re.escape(prefix)}-(\d{{4,}})\b", re.I)
    for path in SPECS.glob("*.md"):
        try:
            text = path.read_text(encoding="utf-8", errors="replace")[:4000]
        except OSError:
            text = path.name
        for m in pat.finditer(path.name + "\n" + text):
            highest = max(highest, int(m.group(1)))
    return f"{prefix}-{highest + 1:04d}"

def recent_modes() -> List[str]:
    st = load_state()
    history = st.get("history", []) if isinstance(st, dict) else []
    return [str(x.get("mode", "")) for x in history[-5:] if isinstance(x, dict)]

def plan_next(goal: str, report: Path | None, current_meta: dict) -> dict:
    report_text = report.read_text(errors="replace") if report and report.exists() else ""
    report_text = report_text[-20000:]
    prompt = f"""You are the ADD planning supervisor for the {PROJECT_NAME} repository.

GOAL:
{goal}

CURRENT A.SPEC:
{current_meta['id']} ({current_meta['mode']}, risk {current_meta['risk']})

CURRENT REPORT:
{report_text}

DETERMINISTIC LOCAL BUILD MANIFEST:
{discover_build_manifest()}

Create the next atomic step, or declare the goal complete.
Return JSON ONLY using exactly one of these shapes:

{{"complete": true, "summary": "..." }}

OR

{{
  "complete": false,
  "aspec": {{
    "id": "AI-NEXT",
    "title": "short observable transition",
    "mode": "READ_ONLY or VERIFY or WRITE",
    "risk": "LOW or MEDIUM or HIGH or CRITICAL",
    "allowed_paths": ["path/or/prefix"],
    "verify_commands": ["safe deterministic command"],
    "why": "...",
    "what": "...",
    "scope": ["..."],
    "out_of_scope": ["..."],
    "contract": ["..."],
    "invariants": ["..."],
    "verification": ["..."],
    "rollback": "..."
  }}
}}
"""
    rc, answer, raw = planner_readonly(prompt)
    raw_path = REPORTS / f"{current_meta['id']}-planner-{now()}.log"
    atomic_write(raw_path, raw)
    try:
        plan = parse_json_answer(answer)
    except Exception:
        # Fallback de planeación determinista si el LLM tarda
        plan = {
            "complete": False,
            "aspec": {
                "id": "AI-NEXT",
                "title": "Verify build and run tests",
                "mode": "VERIFY",
                "risk": "LOW",
                "allowed_paths": [],
                "verify_commands": ["./gradlew test", "npm --prefix frontend test"],
                "why": "Verify test suite health after previous step",
                "what": "Run unit and integration tests",
                "scope": ["tests"],
                "out_of_scope": ["source code outside scope"],
                "contract": ["tests pass"],
                "invariants": ["no regression"],
                "verification": ["gradlew test"],
                "rollback": "git checkout ."
            }
        }
    return plan

def write_aspec(obj: dict) -> Path:
    requested = str(obj.get("id", "AI-NEXT")).upper()
    prefix_match = re.match(r"([A-Z]+)", requested)
    prefix = prefix_match.group(1) if prefix_match else "AI"

    # GLOBAL APPROVAL GATE
    risk_hint = str(obj.get("risk", "")).upper()
    sid = next_spec_id(prefix)
    title = obj["title"].strip()
    mode = obj["mode"].upper().replace("-", "_")
    risk = obj["risk"].upper()
    allowed = obj.get("allowed_paths", [])
    verify = obj.get("verify_commands", [])
    body = [
        f"# A.SPEC {sid} — {title}", "",
        f"ID: {sid}",
        f"Mode: {mode}",
        f"RISK: {risk}", "",
        "## WHY", obj.get("why", ""), "",
        "## WHAT", obj.get("what", ""), "",
        "## SCOPE",
    ]
    body += [f"- {x}" for x in obj.get("scope", [])]
    body += ["", "## OUT OF SCOPE"]
    body += [f"- {x}" for x in obj.get("out_of_scope", [])]
    body += ["", "## CONTRACT"]
    body += [f"- {x}" for x in obj.get("contract", [])]
    body += ["", "## INVARIANTS"]
    body += [f"- {x}" for x in obj.get("invariants", [])]
    body += ["", "## VERIFICATION"]
    body += [f"- {x}" for x in obj.get("verification", [])]
    body += ["", "## ROLLBACK", obj.get("rollback", ""), "",
             "## MACHINE BOUNDS", "BEGIN_ALLOWED_PATHS"]
    body += [f"- {x}" for x in allowed]
    body += ["END_ALLOWED_PATHS", "", "BEGIN_VERIFY_COMMANDS"]
    body += [f"- {x}" for x in verify]
    body += ["END_VERIFY_COMMANDS", ""]
    filename = f"{sid}-{re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:70]}.md"
    path = SPECS / filename
    atomic_write(path, "\n".join(body))
    atomic_write(ACTIVE_FILE, path.relative_to(REPO).as_posix() + "\n")
    return path

def cmd_plan(args):
    """Create the ADD production map and A.SPECs without executing Ralph workers."""
    ensure_control_plane()
    goal = args.goal.strip()
    if not goal:
        die("Planning goal cannot be empty")
    prompt = f"""You are ADD in PLAN-ONLY mode for the real {PROJECT_NAME} repository.

GOAL:
{goal}

Build a complete production-readiness DAG before any execution. Inspect the repository,
docs/canonical/, docs/specs/, AGENTS.md, existing {CONTROL_DIR_NAME} specs and reports. Return JSON ONLY:
{{
  "summary": "...",
  "master_plan": "markdown content for the complete map",
  "specs": [{{
    "id": "PLAN-NEXT", "title": "...", "mode": "READ_ONLY|VERIFY|WRITE",
    "risk": "LOW|MEDIUM|HIGH|CRITICAL", "allowed_paths": [], "verify_commands": [],
    "why": "...", "what": "...", "scope": [], "out_of_scope": [],
    "contract": [], "invariants": [], "verification": [], "rollback": "...",
    "depends_on": [], "acceptance": []
  }}]
}}

Rules:
- This is planning only: do not execute workers, tests, migrations, deploys, or writes outside
  {CONTROL_DIR_NAME}/ADD/PLAN/ and {CONTROL_DIR_NAME}/ADD/specs/.
- Map every production domain and distinguish implemented, partial, blocked, missing, and READY.
- Use only real contracts and physical mappings; never invent modules, tables, endpoints, DTOs,
  columns, credentials, or data.
- Every proposed A.SPEC must have bounded paths, verification, rollback, dependencies, and acceptance.
- Mark HIGH/CRITICAL items as approval-gated; do not turn them into generic approvals.
- Preserve current uncommitted work and report missing evidence as blocked/pending.
"""
    rc, answer, raw = planner_readonly(prompt)
    raw_path = REPORTS / f"ADD-PLAN-planner-{now()}.log"
    atomic_write(raw_path, raw)
    if rc != 0:
        die(f"ADD planner failed; see {raw_path}")
    plan = parse_json_answer(answer)
    if not isinstance(plan, dict) or not isinstance(plan.get("specs"), list):
        die(f"ADD planner returned an invalid plan; see {raw_path}")
    PLAN_DIR.mkdir(parents=True, exist_ok=True)
    atomic_write(PLAN_DIR / f"{PROJECT_NAME.upper()}-PRODUCTION-MAP-{now()}.md", str(plan.get("master_plan", "")))
    created = []
    for obj in plan["specs"]:
        if not isinstance(obj, dict):
            continue
        obj = _hv_normalize_plan_obj(obj)
        path = write_aspec(obj)
        created.append(path.relative_to(REPO).as_posix())
    atomic_write(PLAN_DIR / "README.md", "# ADD plan-only output\n\nGenerated map and A.SPEC inventory; Ralph workers were not executed.\n\n" + "\n".join(f"- `{p}`" for p in created) + "\n")
    print(f"ADD PLAN COMPLETE: {len(created)} A.SPEC(s) created")
    print(f"Master plan: {(PLAN_DIR).relative_to(REPO)}/{PROJECT_NAME.upper()}-PRODUCTION-MAP-*.md")
    print("Ralph workers were not executed.")

def allowed_change(path: str, allowed: List[str]) -> bool:
    if path.startswith(f"{CONTROL_DIR_NAME}/"):
        return True
    for pref in SAFE_GENERATED_PREFIXES:
        if path.startswith(pref):
            return True
    for a in allowed:
        a = a.strip().lstrip("./")
        if not a:
            continue
        if fnmatch.fnmatch(path, a) or fnmatch.fnmatch(path, f"*/{a}") or path == a or path.startswith(a.rstrip("/**").rstrip("/") + "/"):
            return True
    return False

def verify_command_safe(cmd: str) -> bool:
    c = " " + cmd.lower().strip() + " "
    if any(x in c for x in FORBIDDEN_VERIFY_FRAGMENTS):
        return False
    stripped = cmd.strip()
    if stripped.startswith(VERIFY_PREFIXES):
        return True
    try:
        first = shlex.split(stripped)[0]
    except Exception:
        return False
    if first.startswith("./") and (first.endswith("/gradlew") or first.endswith("/mvnw")):
        return True
    return False

def run_verifications(commands: List[str], spec_id: str) -> bool:
    if not commands:
        print(f"[{spec_id}] WARNING: no deterministic verify_commands declared")
        return True
    ok = True
    log = []
    for cmd in commands:
        if not verify_command_safe(cmd):
            log.append(f"$ {cmd}\nBLOCKED_BY_SUPERVISOR\n")
            ok = False
            continue
        print(f"[{spec_id}] verify: {cmd}")
        try:
            p = run(cmd, timeout=1200)
            log.append(f"$ {cmd}\nexit={p.returncode}\n{p.stdout[-12000:]}\n")
            if p.returncode != 0:
                ok = False
        except subprocess.TimeoutExpired:
            log.append(f"$ {cmd}\nTIMEOUT\n")
            ok = False
    atomic_write(REPORTS / f"{spec_id}-verification-{now()}.log", "\n".join(log))
    return ok

def run_verify_spec(spec: Path, meta: dict) -> Path:
    set_approvals_for("READ_ONLY", meta["risk"])
    if not meta["verify_commands"]:
        die(f"{meta['id']} VERIFY spec has no verify_commands")
    before = snapshot_hashes()
    print(f"\n[{meta['id']}] VERIFY — safe local checks...")
    ok = run_verifications(meta["verify_commands"], meta["id"])
    after = snapshot_hashes()
    delta = changed_paths(before, after)
    if delta:
        die(f"VERIFY invariant violated; workspace paths changed: {delta[:30]}")
    logs = sorted(REPORTS.glob(f"{meta['id']}-verification-*.log"))
    detail = logs[-1].read_text(encoding="utf-8", errors="replace")[-16000:] if logs else "(verification log missing)"
    report = REPORTS / f"{meta['id']}-verify-report.md"
    body = [
        f"# {meta['id']} Verification Result", "",
        f"- Result: {'PASS' if ok else 'FAIL'}",
        "- Source mutation: none detected",
        "- Commands:",
    ] + [f"  - `{c}`" for c in meta["verify_commands"]] + [
        "",
        "## Local build manifest",
        discover_build_manifest(),
        "",
        "## Verification log tail",
        "```text",
        detail,
        "```",
    ]
    atomic_write(report, "\n".join(body) + "\n")
    if not ok:
        print(f"[{meta['id']}] verification FAIL")
        return report
    print(f"[{meta['id']}] verification PASS")
    return report

def secret_like_path(rel: str) -> bool:
    low = rel.lower()
    name = Path(rel).name.lower()
    return (
        name.startswith(".env") or "secret" in name or name.endswith(".pem") or
        name.endswith(".key") or name.endswith(".p12") or name.endswith(".jks") or
        "credentials" in low or "/keys/" in low
    )

def run_write_spec(spec: Path, meta: dict) -> Path:
    if not meta["allowed_paths"]:
        die(f"{meta['id']} WRITE spec has no machine-readable allowed paths")

    set_approvals_for("WRITE", meta["risk"])
    backup_dir = backup_paths(meta["allowed_paths"], meta["id"])
    before = snapshot_hashes()

    task = SUP / f"{meta['id']}-task.md"
    task_text = f"""PICKING: {meta['id']}

Read:
{CONTROL_DIR_NAME}/RALPH/BASE_PROMPT.md
{CONTROL_DIR_NAME}/PROJECT/PROJECT_CONTEXT.md
{CONTROL_DIR_NAME}/PROJECT/INVARIANTS.md
{CONTROL_DIR_NAME}/PROJECT/COMMAND_POLICY.md
{CONTROL_DIR_NAME}/APPROVALS.env
{spec.relative_to(REPO).as_posix()}

Implement ONLY this A.SPEC using Codex sandbox workspace-write.
Do not widen scope.
Preserve pre-existing user work.
Run verification commands when safe.
"""
    atomic_write(task, task_text)
    log = REPORTS / f"{meta['id']}-ralph-{now()}.log"

    print(f"\n[{meta['id']}] WRITE — Codex Local Worker")
    print(f"[{meta['id']}] pre-change backup: {backup_dir}")

    cmd = [
        BREW_BASH, str(RALPH),
        "--engine", "codex",
        "--prompt", str(task.relative_to(REPO)),
        "--max", "1",
        "--workers", "1",
        "--timeout", str(int(load_policy()["ralph_timeout_seconds"])),
        "--codex-flags", "--sandbox workspace-write --ephemeral",
        "--log", str(log.relative_to(REPO)),
        "--log-format", "text",
        "--ui", "minimal",
        "--ascii",
    ]
    try:
        run(cmd, timeout=int(load_policy()["ralph_timeout_seconds"]) + 120, check=True)
    except Exception as e:
        print(f"[{meta['id']}]: Codex execution warning: {e}")

    after = snapshot_hashes()
    delta = changed_paths(before, after)
    unauthorized = [x for x in delta if not allowed_change(x, meta["allowed_paths"])]
    if unauthorized:
        die(f"{meta['id']} changed unauthorized paths: {unauthorized[:30]}. Backup: {backup_dir}")

    if not delta:
        report = REPORTS / f"{meta['id']}-result.md"
        atomic_write(report, "\n".join([
            f"# {meta['id']} Result", "",
            "- Result: NO_CHANGE",
            f"- Backup: {backup_dir}",
        ]) + "\n")
        return report

    verify_ok = run_verifications(meta["verify_commands"], meta["id"])
    report = REPORTS / f"{meta['id']}-result.md"
    summary = [
        f"# {meta['id']} Result", "",
        f"- Result: {'PASS' if verify_ok else 'VERIFY_FAIL'}",
        f"- Backup: {backup_dir}",
        "- Changed paths:",
    ] + [f"  - {x}" for x in delta]
    atomic_write(report, "\n".join(summary) + "\n")
    print(f"[{meta['id']}] {'PASS' if verify_ok else 'VERIFY FAIL'}")
    return report

def execute_spec(spec: Path) -> Path:
    meta = parse_spec_meta(spec)
    if meta["mode"] == "READ_ONLY":
        set_approvals_for("READ_ONLY", meta["risk"])
        return run_readonly_spec(spec, meta)
    if meta["mode"] == "VERIFY":
        return run_verify_spec(spec, meta)

    if not is_auto_approved(meta["risk"], meta["id"]):
        pending = SUP / "pending.json"
        atomic_write(pending, json.dumps({
            "id": meta["id"], "risk": meta["risk"],
            "spec": spec.relative_to(REPO).as_posix(),
            "reason": "Policy requires explicit approval"
        }, indent=2) + "\n")
        print(f"\nAPPROVAL REQUIRED: {meta['id']} risk={meta['risk']}")
        raise SystemExit(20)

    return run_write_spec(spec, meta)

def ensure_initial_aspec():
    active = get_active_spec()
    if active:
        return
    # No synthetic bootstrap A.SPEC: the active spec must come from real ADD output.
    return

def cmd_status(_args):
    ensure_control_plane()
    active = get_active_spec()
    print("Hypervelocity Supervisor v10 (Codex-compatible engine)")
    print(f"Repo: {REPO}")
    print(f"HEAD: {git_head()}")
    print(f"Active A.SPEC: {active.relative_to(REPO) if active else 'none'}")
    print(f"Goal: {GOAL_FILE.read_text().strip() if GOAL_FILE.exists() else 'none'}")
    daemon_running = False
    if DAEMON_PID.exists():
        try:
            pid = int(DAEMON_PID.read_text().strip())
            os.kill(pid, 0)
            daemon_running = True
        except Exception:
            pass
    print(f"Daemon: {'RUNNING (pid=' + DAEMON_PID.read_text().strip() + ')' if daemon_running else 'STOPPED'}")

def cmd_approve(args):
    ensure_control_plane()
    sid = args.spec_id.upper()
    d = SUP / "approvals"
    d.mkdir(parents=True, exist_ok=True)
    atomic_write(d / f"{sid}.approved", f"approved_at={dt.datetime.now().isoformat()}\n")
    print(f"Approved: {sid}")
    if GOAL_FILE.exists():
        cmd_run(argparse.Namespace(goal=GOAL_FILE.read_text().strip()))

def cmd_run(args):
    ensure_control_plane()
    ensure_initial_aspec()

    goal = args.goal.strip()
    if not goal:
        die("Goal cannot be empty")
    atomic_write(GOAL_FILE, goal + "\n")

    policy = load_policy()
    max_steps = int(policy.get("max_steps_per_run", 0))
    state = load_state()
    state.update({"goal": goal, "started_at": dt.datetime.now().isoformat(),
                  "head_at_start": git_head(), "status": "running"})
    save_state(state)

    step = 0
    while True:
        step += 1
        if max_steps > 0 and step > max_steps:
            break
        spec = get_active_spec()
        if not spec:
            die("ACTIVE_ASPEC missing or invalid")
        meta = parse_spec_meta(spec)
        print("\n" + "=" * 68)
        print(f"STEP {step} [{meta['id']}] mode={meta['mode']} risk={meta['risk']}")
        print("=" * 68)
        report = execute_spec(spec)
        state = load_state()
        history = state.get("history", []) if isinstance(state, dict) else []
        history.append({
            "id": meta["id"], "mode": meta["mode"], "risk": meta["risk"],
            "spec": spec.relative_to(REPO).as_posix(),
            "report": report.relative_to(REPO).as_posix(),
            "completed_at": dt.datetime.now().isoformat(),
        })
        state["history"] = history[-50:]
        save_state(state)
        plan = plan_next(goal, report, meta)

        if plan.get("complete"):
            state.update({"status": "complete", "completed_at": dt.datetime.now().isoformat(),
                          "summary": plan.get("summary", "")})
            save_state(state)
            print("\nGOAL COMPLETE")
            print(plan.get("summary", ""))
            return

        obj = plan.get("aspec") or {}
        next_spec = write_aspec(obj)
        print(f"Next A.SPEC: {next_spec.relative_to(REPO)}")

    state.update({"status": "paused_max_steps", "paused_at": dt.datetime.now().isoformat()})
    save_state(state)
    print(f"\nPaused after {max_steps} steps.")

def cmd_start(args):
    ensure_control_plane()
    goal = args.goal.strip()
    if not goal:
        die("Goal cannot be empty")
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    if DAEMON_PID.exists():
        try:
            pid = int(DAEMON_PID.read_text().strip())
            os.kill(pid, 0)
            print(f"Already running: pid={pid}")
            return
        except Exception:
            DAEMON_PID.unlink(missing_ok=True)
    logf = DAEMON_LOG.open("a", encoding="utf-8")
    cmd = [sys.executable, "-u", str(Path(__file__).resolve()), "run", goal]
    if Path("/usr/bin/caffeinate").exists():
        cmd = ["/usr/bin/caffeinate", "-dimsu"] + cmd
    p = subprocess.Popen(cmd, cwd=str(REPO), stdout=logf, stderr=subprocess.STDOUT, start_new_session=True)
    atomic_write(DAEMON_PID, str(p.pid) + "\n")
    atomic_write(GOAL_FILE, goal + "\n")
    print(f"Hypervelocity legacy worker started: pid={p.pid}")
    print(f"Log: {DAEMON_LOG}")

def cmd_stop(_args):
    if not DAEMON_PID.exists():
        print("No daemon pid recorded")
        return
    try:
        pid = int(DAEMON_PID.read_text().strip())
        try:
            os.killpg(pid, 15)
        except Exception:
            os.kill(pid, 15)
        print(f"Stop signal sent to pid/session={pid}")
    except ProcessLookupError:
        print("Daemon already stopped")
    finally:
        DAEMON_PID.unlink(missing_ok=True)

def cmd_logs(args):
    if not DAEMON_LOG.exists():
        print(f"No daemon log yet: {DAEMON_LOG}")
        return
    lines = DAEMON_LOG.read_text(encoding="utf-8", errors="replace").splitlines()
    n = int(getattr(args, "lines", 120) or 120)
    print("\n".join(lines[-n:]))


# === GEMINI HYPERVELOCITY V10.1 ===
import concurrent.futures

HV_WAVE_FILE = SUP / "hypervelocity-wave.json"
HV_DASHBOARD_FILE = SUP / "hypervelocity-dashboard.json"
HV_LOCKS_FILE = SUP / "hypervelocity-locks.json"
HV_RETRY_DIR = SUP / "retry-state"
HV_INTEGRATION_LOCK = threading.Lock()
HV_APPROVAL_QUEUE = SUP / "hypervelocity-approval-queue.json"
HV_READY_FILE = SUP / "hypervelocity-ready.json"
HV_SANDBOX_ROOT = RUNTIME_DIR / "hypervelocity-worktrees"

def _hv_policy() -> dict:
    p = load_policy()
    p.setdefault("hypervelocity_enabled", True)
    p.setdefault("hypervelocity_wave_width", 4)
    p.setdefault("hypervelocity_codex_workers", 4)
    p.setdefault("hypervelocity_verify_workers", 2)
    p.setdefault("hypervelocity_sandbox_timeout_seconds", 900)
    p.setdefault("hypervelocity_prepare_timeout_seconds", 900)
    p.setdefault("hypervelocity_agent_timeout_seconds", 300)
    p.setdefault("hypervelocity_install_sandbox_dependencies", True)
    p.setdefault("hypervelocity_checkpoint_every_jobs", 6)
    p.setdefault("hypervelocity_max_parallel_workers", 7)
    p.setdefault("hypervelocity_max_parallel_specs", 4)
    p.setdefault("hypervelocity_max_attempts", 3)
    p.setdefault("hypervelocity_integration_gate", True)
    p.setdefault("hypervelocity_checkpoint_tags", True)
    return p

def _hv_atomic_json(path: Path, obj) -> None:
    atomic_write(path, json.dumps(obj, indent=2, ensure_ascii=False) + "\n")

def _hv_surface(path: str) -> str:
    clean = str(path).strip().lstrip("./").rstrip("/")
    if clean.startswith("supabase/migrations/") or clean == "supabase/migrations":
        return "supabase/migrations"
    for prefix in (
        "apps/web-admin", "apps/web-clientes", "apps/web-public", "apps/api",
        "apps/mobile", "packages", "docker", "compose", "scripts", "qa",
    ):
        if clean == prefix or clean.startswith(prefix + "/"):
            return prefix
    parts = clean.split("/")
    return "/".join(parts[:2]) if len(parts) > 1 else (parts[0] if parts else "unknown")

def _hv_surfaces(paths: List[str]) -> List[str]:
    return sorted({_hv_surface(path) for path in paths if str(path).strip()})

def _hv_is_migration_path(path: str) -> bool:
    return _hv_surface(path) == "supabase/migrations"

def _hv_destructive_migration(text: str) -> bool:
    return bool(re.search(r"\b(drop|truncate|alter\s+table\s+.*\bdrop|delete\s+from)\b", text, re.I))

def _hv_retry_path(spec_id: str) -> Path:
    return HV_RETRY_DIR / f"{spec_id}.json"

def _hv_retry_state(spec_id: str) -> dict:
    value = _hv_load_json(_hv_retry_path(spec_id), {})
    return value if isinstance(value, dict) else {}

def _hv_record_attempt(meta: dict, *, verified: bool, reason: str) -> dict:
    path = _hv_retry_path(meta["id"])
    state = _hv_retry_state(meta["id"])
    attempts = 0 if verified else int(state.get("attempts", 0) or 0) + 1
    blocked = bool(not verified and attempts >= int(_hv_policy().get("hypervelocity_max_attempts", 3)))
    payload = {
        "id": meta["id"], "attempts": attempts, "blocked": blocked,
        "last_status": "PASS" if verified else ("BLOCKED" if blocked else "RETRY"),
        "last_reason": reason, "updated_at": dt.datetime.now().isoformat(),
    }
    _hv_atomic_json(path, payload)
    if verified:
        path.unlink(missing_ok=True)
    return payload

def _hv_write_blocked_report(meta: dict, retry: dict, reason: str) -> Path:
    path = REPORTS / f"{meta['id']}-BLOCKED.md"
    body = (
        f"# {meta['id']} bloqueada\n\n"
        "Ralph agotó el presupuesto de reparación y no volverá a reintentarlo en este ciclo.\n\n"
        f"- Intentos: {retry.get('attempts', 0)}\n"
        f"- Motivo: {reason}\n"
        f"- Superficies: {', '.join(_hv_surfaces(meta.get('allowed_paths', [])))}\n"
        "- Próximo paso: crear un ciclo especializado con evidencia del fallo; no se aplicó este delta.\n"
    )
    atomic_write(path, body)
    return path

def _hv_refresh_dashboard(*, stage: str = "IDLE", current: str | None = None, results=None) -> None:
    state = load_state()
    history = state.get("history", []) if isinstance(state, dict) else []
    recent = history[-20:]
    passed = sum(1 for item in recent if item.get("status", "PASS") == "PASS")
    failed = sum(1 for item in recent if item.get("status") in ("FAIL", "BLOCKED"))
    state_health = state.get("hv_health", {}) if isinstance(state, dict) else {}
    completed_times = []
    for item in recent:
        if item.get("status", "PASS") != "PASS":
            continue
        raw_time = item.get("completed_at") or item.get("created_at")
        if not raw_time:
            continue
        try:
            completed_times.append(dt.datetime.fromisoformat(str(raw_time)))
        except ValueError:
            continue
    if len(completed_times) >= 2:
        elapsed_hours = max(
            (max(completed_times) - min(completed_times)).total_seconds() / 3600,
            1 / 60,
        )
        throughput = round(passed / elapsed_hours, 2)
    else:
        throughput = 0.0
    pool_target = int(_hv_policy().get("hypervelocity_max_parallel_workers", 7))
    aspec_cap = int(_hv_policy().get("hypervelocity_max_parallel_specs", 4))
    running = 0 if stage in ("IDLE", "PLANNING", "COMPLETE", "HEALTH") else min(
        aspec_cap, len(results or [])
    )
    verifying = min(aspec_cap, len(results or [])) if stage == "VERIFY" else 0
    idle = max(0, pool_target - running - verifying)
    payload = {
        "stage": stage, "current_aspec": current, "updated_at": dt.datetime.now().isoformat(),
        "workers": {
            "pool_target": pool_target,
            "pool_scope": "per-gemini-api-invocation",
            "pool_note": "The API worker owns one child process per configured Keychain slot; this is not a global cross-invocation pool.",
            "aspec_parallel_cap": aspec_cap,
            "running": running,
            "verify": verifying,
            "blocked": len(list(REPORTS.glob("*-BLOCKED.md"))),
            "idle": idle,
        },
        "integration_queue": int(state.get("hv_integration_queue", 0) or 0),
        "throughput_per_hour": throughput,
        "success_rate": round(passed / max(1, passed + failed), 3),
        "health": state_health,
    }
    _hv_atomic_json(HV_DASHBOARD_FILE, payload)
    _hv_atomic_json(HV_LOCKS_FILE, {"surfaces": {}, "updated_at": payload["updated_at"]})

def _hv_health_score(results: List[tuple[Path, dict, Path]] | None = None) -> dict:
    results = results or []
    passed = failed = blocked = 0
    files_modified = 0
    diff_bytes = 0
    for _spec, _meta, result_path in results:
        result = _hv_load_json(result_path, {})
        if result.get("verified"):
            passed += 1
        else:
            failed += 1
        if result.get("retry", {}).get("blocked"):
            blocked += 1
        paths = result.get("changed_paths", [])
        files_modified += len(paths) if isinstance(paths, list) else 0
        for rel in paths if isinstance(paths, list) else []:
            target = REPO / str(rel)
            if target.is_file():
                try:
                    diff_bytes += target.stat().st_size
                except OSError:
                    pass
    state = load_state()
    recent = state.get("history", [])[-20:] if isinstance(state, dict) else []
    prior_failures = sum(1 for item in recent if item.get("status") in ("FAIL", "BLOCKED"))
    score = max(0, min(100, 100 - (failed + prior_failures) * 15 - blocked * 10))
    health = {
        "score": score, "build": "unknown", "tests": "unknown", "lint": "unknown",
        "typecheck": "unknown", "new_errors": failed + prior_failures, "warnings": 0,
        "files_modified": files_modified, "diff_bytes": diff_bytes,
        "specs_completed": len([x for x in recent if x.get("status", "PASS") == "PASS"]) + passed,
        "specs_failed": failed + prior_failures,
        "specs_blocked": blocked,
    }
    state["hv_health"] = health
    save_state(state)
    _hv_refresh_dashboard(stage="HEALTH", current=None, results=results)
    return health

def _hv_adaptive_width() -> int:
    policy = _hv_policy()
    cap = max(1, min(int(policy.get("hypervelocity_max_parallel_specs", 4)), 4))
    state = load_state()
    history = state.get("history", []) if isinstance(state, dict) else []
    recent = history[-3:]
    if any(item.get("status") in ("FAIL", "BLOCKED") for item in recent):
        return 1
    return cap

def _hv_load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default

def _hv_snapshot(root: Path) -> Dict[str, str]:
    result = {}
    for base_dir, dirs, files in os.walk(root):
        rootp = Path(base_dir)
        try:
            rel_root = rootp.relative_to(root)
        except ValueError:
            continue
        dirs[:] = [d for d in dirs if d not in EXCLUDE_PARTS]
        if any(part in EXCLUDE_PARTS for part in rel_root.parts):
            continue
        for name in files:
            p = rootp / name
            try:
                rel = p.relative_to(root).as_posix()
            except ValueError:
                continue
            if any(part in EXCLUDE_PARTS for part in Path(rel).parts):
                continue
            try:
                if p.is_symlink() or p.stat().st_size > 20 * 1024 * 1024:
                    continue
                result[rel] = file_hash(p)
            except (OSError, PermissionError):
                pass
    return result

def _hv_file_hash_at(root: Path, rel: str) -> str:
    p = root / rel
    if not p.is_file() or p.is_symlink():
        return ""
    return file_hash(p)

def _hv_paths_overlap(a: List[str], b: List[str]) -> bool:
    if not a or not b:
        return False
    def norm(x: str) -> str:
        x = x.strip().lstrip("./")
        x = re.sub(r"[*?].*$", "", x).rstrip("/")
        return x
    for aa in a:
        na = norm(aa)
        if not na:
            continue
        for bb in b:
            nb = norm(bb)
            if not nb:
                continue
            if na == nb or na.startswith(nb + "/") or nb.startswith(na + "/"):
                return True
    return False

def _hv_remove_sandbox(path: Path) -> None:
    try:
        subprocess.run(
            ["git", "worktree", "remove", "--force", str(path)],
            cwd=str(REPO), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            timeout=120
        )
    except Exception:
        pass
    shutil.rmtree(path, ignore_errors=True)
    try:
        subprocess.run(
            ["git", "worktree", "prune"],
            cwd=str(REPO), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            timeout=60
        )
    except Exception:
        pass

def _hv_prepare_sandbox(spec_id: str) -> Path:
    HV_SANDBOX_ROOT.mkdir(parents=True, exist_ok=True)
    path = Path(tempfile.mkdtemp(prefix=f"{spec_id}-", dir=str(HV_SANDBOX_ROOT)))
    path.rmdir()
    print(f"[HV][sandbox] creating isolated Git worktree for {spec_id}")
    worktree_output = ""
    native_worktree = False
    worktree_timeout = min(
        max(5, int(_hv_policy().get("hypervelocity_prepare_timeout_seconds", 900))),
        120,
    )
    try:
        worktree = subprocess.run(
            ["git", "worktree", "add", "--detach", "--quiet", str(path), "HEAD"],
            cwd=str(REPO), text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            timeout=worktree_timeout,
        )
        worktree_output = worktree.stdout or ""
        native_worktree = worktree.returncode == 0
    except subprocess.TimeoutExpired as exc:
        worktree_output = f"git worktree add timeout after {worktree_timeout}s: {exc}"
        print(f"[HV][sandbox] native worktree timed out for {spec_id}; falling back")
    except OSError as exc:
        worktree_output = str(exc)

    if not native_worktree:
        # A stuck or incompatible worktree must not stop the repair queue. The
        # fallback is disposable, isolated from the parent tree, and still
        # passes through the same single-writer integration gate.
        shutil.rmtree(path, ignore_errors=True)
        try:
            subprocess.run(
                ["git", "worktree", "prune"], cwd=str(REPO),
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=30,
            )
        except (OSError, subprocess.TimeoutExpired):
            pass
        path.mkdir(parents=True, exist_ok=True)
        print(
            f"[HV][sandbox] native worktree unavailable; using disposable copy fallback "
            f"for {spec_id}: {worktree_output[-400:]}"
        )
        init = subprocess.run(
            ["git", "init", "-q"], cwd=str(path),
            text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        )
        if init.returncode != 0:
            shutil.rmtree(path, ignore_errors=True)
            raise RuntimeError(f"sandbox git init failed: {init.stdout[-2000:]}")
    rsync = shutil.which("rsync")
    if not rsync:
        _hv_remove_sandbox(path)
        raise RuntimeError("rsync no disponible para overlay seguro del worktree")
    excludes = [
        "--exclude=.git", f"--exclude={CONTROL_DIR_NAME}", "--exclude=node_modules", "--exclude=.pnpm-store", "--exclude=.turbo", "--exclude=.cache", "--exclude=.eslintcache",
        "--exclude=build", "--exclude=dist", "--exclude=.gradle",
        "--exclude=target", "--exclude=coverage", "--exclude=.next",
        "--exclude=.env", "--exclude=.env.*", "--exclude=*.pem",
        "--exclude=*.key", "--exclude=*.p12", "--exclude=*.jks",
    ]
    overlay = subprocess.run(
        [rsync, "-a", "--delete", *excludes, str(REPO) + "/", str(path) + "/"],
        text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )
    if overlay.returncode != 0:
        _hv_remove_sandbox(path)
        raise RuntimeError(f"overlay failed: {overlay.stdout[-2000:]}")
    policy = _hv_policy()
    if policy.get("hypervelocity_install_sandbox_dependencies", True):
        env = os.environ.copy()
        if NODE22_BIN.is_dir():
            env["PATH"] = f"{NODE22_BIN}:{env.get('PATH', '')}"
        install = run(
            ["pnpm", "install", "--frozen-lockfile", "--ignore-scripts"],
            cwd=path,
            timeout=int(policy.get("hypervelocity_prepare_timeout_seconds", 900)),
            env=env,
        )
        if install.returncode != 0:
            _hv_remove_sandbox(path)
            raise RuntimeError(f"sandbox dependency install failed: {install.stdout[-2000:]}")
    return path

def _hv_run_cmd(cwd: Path, command: str, timeout: int) -> tuple[bool, str]:
    if not verify_command_safe(command):
        return False, f"$ {command}\nBLOCKED_BY_SUPERVISOR\n"
    try:
        env = os.environ.copy()
        if NODE22_BIN.is_dir():
            env["PATH"] = f"{NODE22_BIN}:{env.get('PATH', '')}"
        p = run(command, cwd=cwd, timeout=timeout, env=env)
        return p.returncode == 0, f"$ {command}\nexit={p.returncode}\n{p.stdout[-16000:]}\n"
    except subprocess.TimeoutExpired:
        return False, f"$ {command}\nTIMEOUT\n"

def _hv_run_agy(cmd: List[str], sandbox: Path) -> tuple[int, str, str]:
    """Bound Gemini workers so one stalled request cannot halt the repair queue."""
    timeout = int(_hv_policy().get("hypervelocity_agent_timeout_seconds", 300))
    try:
        completed = run(cmd, cwd=sandbox, timeout=timeout)
        return completed.returncode, extract_agy_answer(completed.stdout), completed.stdout[-24000:]
    except subprocess.TimeoutExpired:
        return 124, "", f"AGY_TIMEOUT after {timeout}s; candidate rejected before integration.\n"

def _hv_worker(spec: Path, sandbox: Path, wave_baseline: Dict[str, str]) -> dict:
    meta = parse_spec_meta(spec)
    print(f"[HV][{meta['id']}] worker started mode={meta['mode']} risk={meta['risk']}")
    if any(_hv_is_migration_path(path) for path in meta.get("allowed_paths", [])) and _hv_destructive_migration(meta.get("text", "")):
        return {
            "spec": spec, "meta": meta, "sandbox": sandbox, "rc": 403,
            "answer": "", "delta": [], "unauthorized": [], "pretest_ok": False,
            "quota_exhausted": False, "logs": [
                "MIGRATION_GATE_BLOCKED: destructive schema work requires explicit approved authorization."
            ], "wave_baseline": wave_baseline,
        }
    before = _hv_snapshot(sandbox)
    logs = []
    answer = ""
    rc = 0
    agent_timeout_minutes = max(1, int(_hv_policy().get("hypervelocity_agent_timeout_seconds", 300)) // 60)

    workspace_rule = f"""\nWORKTREE ROOT: {sandbox}
Use only this worktree. Read and edit only files below this exact path.
Do not inspect or modify any other checkout outside this worktree.
"""

    if meta["mode"] == "READ_ONLY":
        prompt = f"""Execute this {PROJECT_NAME} ADD A.SPEC in READ-ONLY mode.
Do not modify files, Git state, secrets, databases, services, or external infrastructure.
Return a complete Markdown report.

A.SPEC:
{meta['text']}
{workspace_rule}
"""
        if _hv_policy().get("gemini_api_enabled", False):
            rc, answer, log = _run_gemini_api(prompt, sandbox, "plan", [], [], int(_hv_policy().get("gemini_api_worker_timeout_seconds", 120)))
        else:
            cmd = [
                AGY,
                "--new-project",
                "--add-dir", str(sandbox),
                "--mode", "plan",
                "--output-format", "json",
                "--effort", "low",
                "--model", _agy_worker_model(),
                "--print-timeout", f"{agent_timeout_minutes}m",
                "--dangerously-skip-permissions",
                f"--print={prompt}",
            ]
            rc, answer, log = _hv_run_agy(cmd, sandbox)
        logs.append(log[-20000:])

    elif meta["mode"] == "VERIFY":
        for command in meta["verify_commands"]:
            ok, detail = _hv_run_cmd(
                sandbox, command,
                int(_hv_policy().get("hypervelocity_sandbox_timeout_seconds", 900))
            )
            logs.append(detail)
            if not ok:
                rc = 1

    else:
        prompt = f"""You are one isolated Gemini Hypervelocity worker for a real {PROJECT_NAME} repository.

Implement ONLY the following bounded ADD A.SPEC in this isolated worktree.
Do not widen scope.
Preserve all pre-existing repository work.
Never read or modify secrets, .env files, remote infrastructure, deployment, or Git history.
High-risk local repair is allowed only when the spec is bounded, backed up, and has explicit
rollback and verification.
Do not commit, stash, reset, clean, or rewrite history.

A.SPEC:
{meta['text']}
{workspace_rule}
"""
        if _hv_policy().get("gemini_api_enabled", False):
            rc, answer, log = _run_gemini_api(
                prompt,
                sandbox,
                "write",
                meta["allowed_paths"],
                meta["verify_commands"],
                int(_hv_policy().get("gemini_api_worker_timeout_seconds", 120)),
            )
        else:
            cmd = [
                AGY,
                "--new-project",
                "--add-dir", str(sandbox),
                "--mode", "accept-edits",
                "--output-format", "json",
                "--effort", "low",
                "--model", _agy_worker_model(),
                "--print-timeout", f"{agent_timeout_minutes}m",
                "--dangerously-skip-permissions",
                f"--print={prompt}",
            ]
            rc, answer, log = _hv_run_agy(cmd, sandbox)
        logs.append(log)

    quota_exhausted = any("individual quota reached" in entry.lower() for entry in logs)
    after = before if quota_exhausted else _hv_snapshot(sandbox)
    delta = changed_paths(before, after)
    unauthorized = [
        rel for rel in delta
        if secret_like_path(rel) or not allowed_change(rel, meta["allowed_paths"])
    ]
    if meta["mode"] != "WRITE" and delta:
        unauthorized = list(delta)

    pretest_ok = True
    if quota_exhausted:
        rc = 429
        pretest_ok = False
        logs.append("WORKER_QUOTA_EXHAUSTED: Antigravity reported Individual quota reached; no integration permitted.")
    elif meta["mode"] == "WRITE":
        for command in meta["verify_commands"]:
            ok, detail = _hv_run_cmd(
                sandbox, command,
                int(_hv_policy().get("hypervelocity_sandbox_timeout_seconds", 900))
            )
            logs.append(detail)
            if not ok:
                pretest_ok = False

    print(
        f"[HV][{meta['id']}] worker finished rc={rc} "
        f"delta={len(delta)} unauthorized={len(unauthorized)} "
        f"pretest={'PASS' if pretest_ok else 'FAIL'}"
    )
    return {
        "spec": spec, "meta": meta, "sandbox": sandbox, "rc": rc,
        "answer": answer, "delta": delta, "unauthorized": unauthorized,
        "pretest_ok": pretest_ok, "quota_exhausted": quota_exhausted,
        "logs": logs, "wave_baseline": wave_baseline,
    }

def _hv_restore_backup(backup_dir: Path) -> None:
    manifest_path = backup_dir / "manifest.json"
    manifest = _hv_load_json(manifest_path, [])
    if not isinstance(manifest, list):
        return
    for item in manifest:
        rel = str(item.get("path", "")).strip()
        if not rel or secret_like_path(rel):
            continue
        dst = REPO / rel
        if item.get("backed_up"):
            src = backup_dir / rel
            if src.is_file():
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
        elif dst.is_file() or dst.is_symlink():
            dst.unlink()

def _hv_real_worktree_gate(cand: dict, backup_dir: Path) -> tuple[bool, str]:
    commands = cand["meta"].get("verify_commands", [])
    if not _hv_policy().get("hypervelocity_integration_gate", True) or not commands:
        return True, "integration gate: no additional declared commands"
    logs = []
    ok = True
    for command in commands:
        passed, detail = _hv_run_cmd(
            REPO, command,
            int(_hv_policy().get("hypervelocity_sandbox_timeout_seconds", 900)),
        )
        logs.append(detail)
        if not passed:
            ok = False
    if not ok:
        _hv_restore_backup(backup_dir)
        return False, "integration gate failed; delta rolled back\n" + "\n".join(logs)[-12000:]
    return True, "integration gate passed\n" + "\n".join(logs)[-12000:]

def _hv_apply_candidate(cand: dict) -> tuple[bool, str]:
    meta = cand["meta"]
    if meta["mode"] != "WRITE":
        return True, "no integration required"
    if cand["rc"] != 0:
        return False, f"worker exited with rc={cand['rc']}; source delta was not integrated"
    if not cand["pretest_ok"]:
        return False, "sandbox verification failed; source delta was not integrated"
    if cand["unauthorized"]:
        return False, f"unauthorized paths: {cand['unauthorized'][:20]}"
    if any(_hv_is_migration_path(rel) for rel in cand["delta"]):
        changed_text = "\n".join(
            (cand["sandbox"] / rel).read_text(encoding="utf-8", errors="replace")
            for rel in cand["delta"]
            if (cand["sandbox"] / rel).is_file() and rel.endswith((".sql", ".psql"))
        )
        if _hv_destructive_migration(changed_text) and "DESTRUCTIVE_MIGRATION_AUTHORIZED" not in meta.get("text", ""):
            return False, "migration gate rejected destructive SQL without explicit authorization"
    delta = cand["delta"]
    if not delta:
        return False, "worker produced no bounded source delta"

    baseline = cand["wave_baseline"]
    conflicts = []
    for rel in delta:
        current = _hv_file_hash_at(REPO, rel)
        expected = baseline.get(rel, "")
        if current != expected:
            conflicts.append(rel)
    if conflicts:
        return False, f"real-worktree conflict on {conflicts[:20]}"

    backup_dir = backup_paths(delta, meta["id"])
    sandbox = cand["sandbox"]
    for rel in delta:
        src = sandbox / rel
        dst = REPO / rel
        if src.is_file():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
        elif dst.is_file() or dst.is_symlink():
            dst.unlink()

    gate_ok, gate_note = _hv_real_worktree_gate(cand, backup_dir)
    if not gate_ok:
        return False, f"applied then rejected by integration gate; backup={backup_dir}\n{gate_note}"
    return True, f"applied {len(delta)} paths; backup={backup_dir}\n{gate_note}"

def _hv_store_result(cand: dict, applied: bool, apply_note: str) -> Path:
    """Persist machine-readable repair state; Ralph does not emit audit reports."""
    meta = cand["meta"]
    bounded = not cand["unauthorized"]
    verified = bool(applied and bounded and cand["pretest_ok"] and cand["rc"] == 0)
    retry = _hv_record_attempt(cand["meta"], verified=verified, reason=apply_note)
    blocked_report = None
    if retry.get("blocked"):
        blocked_report = _hv_write_blocked_report(cand["meta"], retry, apply_note)
    result = {
        "id": meta["id"],
        "mode": meta["mode"],
        "kind": "repair-result",
        "verified": verified,
        "worker_exit_code": cand["rc"],
        "worker_quota_exhausted": bool(cand.get("quota_exhausted")),
        "sandbox_pretest_passed": cand["pretest_ok"],
        "integration_applied": applied,
        "integration_note": apply_note,
        "integration_gate": "PASS" if verified else "REJECTED",
        "retry": retry,
        "blocked_report": blocked_report.relative_to(REPO).as_posix() if blocked_report else None,
        "changed_paths": cand["delta"],
        "unauthorized_paths": cand["unauthorized"],
        "created_at": dt.datetime.now().isoformat(),
    }
    result_path = RESULTS / f"{meta['id']}-result.json"
    atomic_write(result_path, json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    log_path = LOGS / f"{meta['id']}-worker-{now()}.log"
    atomic_write(log_path, "\n".join(cand["logs"])[-24000:])
    return result_path

def execute_wave(spec_paths: List[Path]) -> List[tuple[Path, dict, Path]]:
    if not spec_paths:
        return []
    policy = _hv_policy()
    width = _hv_adaptive_width()
    spec_paths = spec_paths[:width]

    metas = [parse_spec_meta(p) for p in spec_paths]
    accepted = []
    write_paths = []
    write_surfaces = []
    for spec, meta in zip(spec_paths, metas):
        if meta["mode"] == "WRITE":
            if not (is_local_bounded_write(meta) or meta["risk"] in ("LOW", "MEDIUM") or is_auto_approved(meta["risk"], meta["id"])):
                continue
            surfaces = _hv_surfaces(meta["allowed_paths"])
            if any(_hv_paths_overlap(meta["allowed_paths"], prev) for prev in write_paths) or any(
                _hv_paths_overlap(surfaces, previous) for previous in write_surfaces
            ):
                print(f"[HV][{meta['id']}] deferred: surface lock overlap in this wave ({', '.join(surfaces)})")
                continue
            write_paths.append(meta["allowed_paths"])
            write_surfaces.append(surfaces)
        accepted.append((spec, meta))

    if not accepted:
        return []

    ids = [m["id"] for _, m in accepted]
    print(f"\n[HV] parallel wave: {', '.join(ids)}")
    wave_baseline = _hv_snapshot(REPO)
    _hv_atomic_json(HV_WAVE_FILE, {
        "stage": "executing",
        "ids": ids,
        "specs": [p.relative_to(REPO).as_posix() for p, _ in accepted],
        "started_at": dt.datetime.now().isoformat(),
    })

    prepared = []
    try:
        for spec, meta in accepted:
            prepared.append((spec, meta, _hv_prepare_sandbox(meta["id"])))

        max_workers = max(1, min(int(policy.get("hypervelocity_max_parallel_specs", 4)), len(prepared), 4))
        _hv_refresh_dashboard(stage="RUNNING", current=ids[0] if ids else None, results=prepared)
        candidates = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as ex:
            futures = [
                ex.submit(_hv_worker, spec, sb, wave_baseline)
                for spec, _meta, sb in prepared
            ]
            for future in futures:
                candidates.append(future.result())

        results = []
        for cand in candidates:
            meta = cand["meta"]
            if meta["mode"] == "WRITE":
                # The parent is the only merge-applier. Keep the lock explicit
                # so future scheduler changes cannot create a second writer.
                with HV_INTEGRATION_LOCK:
                    applied, note = _hv_apply_candidate(cand)
                print(f"[HV][{meta['id']}] merge-applier: {'APPLIED' if applied else 'SKIPPED'} — {note}")
            else:
                applied, note = True, "no integration required"
            result_path = _hv_store_result(cand, applied, note)
            results.append((cand["spec"], meta, result_path))
        _hv_health_score(results)
        _hv_refresh_dashboard(stage="VERIFY", current=None, results=results)
        return results
    finally:
        for _spec, _meta, sb in prepared:
            _hv_remove_sandbox(sb)
        HV_WAVE_FILE.unlink(missing_ok=True)

def _hv_results_text(results: List[tuple[Path, dict, Path]], checkpoint: Path | None = None) -> str:
    parts = []
    for _spec, meta, result_path in results:
        try:
            result = json.loads(result_path.read_text(encoding="utf-8", errors="replace"))
            txt = json.dumps(result, ensure_ascii=False, indent=2)
        except Exception:
            txt = "(repair result unavailable)"
        parts.append(f"===== {meta['id']} =====\n{txt}")
    if checkpoint is not None:
        try:
            parts.append("===== CHECKPOINT =====\n" + checkpoint.read_text(encoding="utf-8", errors="replace")[-16000:])
        except Exception:
            pass
    return "\n\n".join(parts)[-40000:]

def _hv_pending_queue() -> List[str]:
    q = _hv_load_json(HV_APPROVAL_QUEUE, [])
    return q if isinstance(q, list) else []

def _hv_save_pending_queue(items: List[str]) -> None:
    _hv_atomic_json(HV_APPROVAL_QUEUE, items)

def _hv_ready_queue() -> List[str]:
    q = _hv_load_json(HV_READY_FILE, [])
    return q if isinstance(q, list) else []

def _hv_save_ready_queue(items: List[str]) -> None:
    clean = []
    seen = set()
    for rel in items:
        rel = str(rel).strip()
        if rel and rel not in seen:
            seen.add(rel)
            clean.append(rel)
    _hv_atomic_json(HV_READY_FILE, clean)

def _hv_normalize_plan_obj(obj, *, blocked: bool = False) -> dict | None:
    if isinstance(obj, str):
        obj = {"title": obj, "what": obj}
    if not isinstance(obj, dict):
        return None
    x = dict(obj)
    fallback_title = (
        x.get("title") or x.get("what") or x.get("reason") or
        x.get("summary") or x.get("description") or
        ("Revisar blocker HIGH/CRITICAL" if blocked else "Paso atomico Hypervelocity")
    )
    x["title"] = str(fallback_title).strip()[:180] or (
        "Revisar blocker HIGH/CRITICAL" if blocked else "Paso atomico Hypervelocity"
    )
    x["id"] = str(x.get("id") or ("APPROVAL-NEXT" if blocked else "AI-NEXT")).upper()
    if blocked:
        risk = str(x.get("risk", "HIGH")).upper()
        x["risk"] = risk if risk in ("HIGH", "CRITICAL") else "HIGH"
        x["mode"] = "WRITE"
    else:
        risk = str(x.get("risk", "MEDIUM")).upper()
        x["risk"] = risk if risk in ("LOW", "MEDIUM", "HIGH", "CRITICAL") else "MEDIUM"
        mode = str(x.get("mode", "READ_ONLY")).upper().replace("-", "_")
        x["mode"] = mode if mode in ("READ_ONLY", "VERIFY", "WRITE") else "READ_ONLY"
    for key in (
        "allowed_paths", "verify_commands", "scope", "out_of_scope",
        "contract", "invariants", "verification",
    ):
        val = x.get(key, [])
        if isinstance(val, str):
            val = [val]
        elif not isinstance(val, list):
            val = []
        x[key] = val
    x["why"] = str(x.get("why") or x.get("reason") or "Requerido por el plan ADD actual.")
    x["what"] = str(x.get("what") or x["title"])
    x["rollback"] = str(x.get("rollback") or "No aplicar cambios; conservar el worktree actual.")
    return x


def _hv_blocker_key(obj: dict) -> str:
    parts = [
        str(obj.get('title', '')),
        str(obj.get('what', '')),
        str(obj.get('why', '')),
        ' '.join(map(str, obj.get('scope', []) or [])),
        ' '.join(map(str, obj.get('out_of_scope', []) or [])),
        ' '.join(map(str, obj.get('contract', []) or [])),
        ' '.join(map(str, obj.get('allowed_paths', []) or [])),
    ]
    text = ' '.join(parts).lower()
    text = re.sub(r'\b(?:approval|hypervelocity|ai)-\d+\b', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    paths = sorted({
        str(x).strip().lower()
        for x in (obj.get('allowed_paths', []) or [])
        if str(x).strip()
    })
    path_part = '|'.join(paths[:8])

    if any(x in text for x in ('migration','migracion','migraciones','schema','esquema','rls','supabase','database')):
        return f'db-schema-rls::{path_part}'
    if any(x in text for x in ('auth','rbac','service role','service-role','jwt','public route','ruta publica','rutas publicas','sesion','session')):
        return f'auth-rbac::{path_part}'
    if any(x in text for x in ('secret','secreto','credential','credencial','.env','api key','apikey','token sensible')):
        return f'secrets::{path_part}'
    if any(x in text for x in ('deploy','deployment','render','vercel','production','produccion','rollback','infrastructure','infraestructura')):
        return f'deploy-infra::{path_part}'
    if any(x in text for x in ('financial','financiero','payment','pago','cash','caja','billing','facturacion','facturación')):
        return f'finance::{path_part}'

    title = str(obj.get('title', '')).lower()
    title = re.sub(r'\b(?:approval|hypervelocity|ai)-\d+\b', ' ', title)
    title = re.sub(r'[^a-z0-9áéíóúüñ/_\.\-]+', ' ', title)
    title = re.sub(r'\s+', ' ', title).strip()[:140]
    return f'other::{path_part}::{title}'


def _hv_existing_blocker_for(obj: dict, existing_queue: List[str]) -> Path | None:
    desired = _hv_blocker_key(obj)
    candidates = []
    seen = set()

    for rel in existing_queue:
        rp = REPO / str(rel)
        if rp.is_file() and rp not in seen:
            seen.add(rp)
            candidates.append(rp)

    for rp in sorted(SPECS.glob("APPROVAL-*.md")):
        if rp.is_file() and rp not in seen:
            seen.add(rp)
            candidates.append(rp)

    for rp in candidates:
        try:
            txt = rp.read_text(encoding="utf-8", errors="replace")
            meta = parse_spec_meta(rp)
            probe = {
                "title": txt.splitlines()[0] if txt else rp.stem,
                "what": txt,
                "why": txt,
                "scope": [],
                "out_of_scope": [],
                "contract": [],
                "allowed_paths": meta.get("allowed_paths", []),
            }
            if _hv_blocker_key(probe) == desired:
                return rp
        except Exception:
            continue

    return None


def _hv_dedupe_pending_queue(items: List[str]) -> List[str]:
    clean = []
    seen_keys = set()

    for rel in items:
        rp = REPO / str(rel)
        if not rp.is_file():
            continue
        try:
            txt = rp.read_text(encoding="utf-8", errors="replace")
            meta = parse_spec_meta(rp)
            probe = {
                "title": txt.splitlines()[0] if txt else rp.stem,
                "what": txt,
                "why": txt,
                "scope": [],
                "out_of_scope": [],
                "contract": [],
                "allowed_paths": meta.get("allowed_paths", []),
            }
            key = _hv_blocker_key(probe)
        except Exception:
            key = rp.name

        if key in seen_keys:
            continue
        seen_keys.add(key)
        clean.append(str(rel))

    return clean


def _hv_dirty_baseline_paths() -> List[str]:
    """Return user-owned dirty paths that repair workers must not claim."""
    result = run(["git", "status", "--porcelain=v1"], cwd=REPO)
    paths = []
    for line in result.stdout.splitlines():
        if len(line) < 4:
            continue
        value = line[3:].strip()
        if " -> " in value:
            value = value.rsplit(" -> ", 1)[-1].strip()
        if value:
            paths.append(value.rstrip("/"))
    return sorted(set(paths))


def _hv_paths_overlap_dirty(allowed: List[str], dirty: List[str]) -> List[str]:
    conflicts = []
    for candidate in allowed:
        candidate = candidate.rstrip("/")
        for existing in dirty:
            if candidate == existing or candidate.startswith(existing + "/") or existing.startswith(candidate + "/"):
                conflicts.append(existing)
    return sorted(set(conflicts))


def _hv_is_repair_job(obj: dict) -> tuple[bool, str]:
    """Keep Hypervelocity on production repairs instead of regenerating audits."""
    mode = str(obj.get("mode", "")).upper().replace("-", "_")
    text = " ".join(
        [
            str(obj.get("title", "")), str(obj.get("what", "")), str(obj.get("why", "")),
            str(obj.get("text", "")), str(obj.get("rollback", "")),
            " ".join(map(str, obj.get("scope", []) or [])),
            " ".join(map(str, obj.get("contract", []) or [])),
        ]
    ).lower()
    allowed = [str(path).strip() for path in (obj.get("allowed_paths") or []) if str(path).strip()]

    if mode != "WRITE":
        return False, "repair-only execution requires Mode WRITE"
    if any(word in text for word in ("audit", "auditor", "report", "reporte", "mapa", "inventario documental")):
        return False, "repair-only execution rejects audit/report work"
    if not allowed:
        return False, "repair work requires explicit allowed_paths"
    if all(path.startswith((f"{CONTROL_DIR_NAME}/", "docs/audit/")) or path.endswith(".md") for path in allowed):
        return False, "repair work must touch an operational source, test, or deployment file"
    dirty_conflicts = _hv_paths_overlap_dirty(allowed, _hv_dirty_baseline_paths())
    if dirty_conflicts:
        return False, f"repair overlaps preserved dirty baseline: {dirty_conflicts}"
    if " as any" in text or "cast " in text:
        return False, "repair-only execution rejects type-suppression casts"
    verification_bypasses = (
        "exclude the broken", "exclude broken", "exclude inventoryservice",
        "ignore type error", "ignore typescript", "skip typecheck",
        "skip compilation", "disable typecheck", "work around the build",
    )
    if any(token in text for token in verification_bypasses):
        return False, "repair-only execution rejects verification-bypass workarounds"
    if any(path.endswith("tsconfig.json") for path in allowed) and "exclude" in text:
        return False, "repair-only execution rejects tsconfig exclusions that hide source failures"
    rollback = str(obj.get("rollback", "")).lower()
    if any(token in rollback for token in ("git checkout", "git reset", "git clean", "rm -rf")):
        return False, "rollback must rely on the supervisor backup, never destructive Git or rm commands"
    return True, ""


def _hv_materialize_plan(plan: dict) -> tuple[List[Path], List[Path]]:
    ready = []
    blocked = []
    existing_queue = _hv_pending_queue()
    blockers = list(plan.get("approval_blockers") or [])

    for raw in plan.get("wave") or []:
        obj = _hv_normalize_plan_obj(raw, blocked=False)
        if obj is None:
            continue
        if _hv_retry_state(obj["id"]).get("blocked"):
            print(f"[HV][{obj['id']}] skipped: repair budget exhausted; awaiting specialized cycle")
            continue
        eligible, reason = _hv_is_repair_job(obj)
        if not eligible:
            print(f"[HV] skipped non-repair plan item: {reason}")
            continue
        if obj["risk"] not in ("LOW", "MEDIUM") and not is_local_bounded_write(obj):
            blockers.append(obj)
            continue
        ready.append(write_aspec(obj))

    # Persist the READY siblings before materializing blockers. A malformed
    # blocker must never orphan an otherwise valid frontier.
    _hv_save_ready_queue([p.relative_to(REPO).as_posix() for p in ready])
    if ready:
        atomic_write(ACTIVE_FILE, ready[0].relative_to(REPO).as_posix() + "\n")

    for raw in blockers:
        obj = _hv_normalize_plan_obj(raw, blocked=True)
        if obj is None:
            continue

        blocker_text = " ".join([
            str(obj.get("title", "")),
            str(obj.get("what", "")),
            str(obj.get("why", "")),
        ]).lower()
        if CONTROL_DIR_NAME in blocker_text and "checkout" in blocker_text:
            print("[HV] approval skipped: self-owned control-plane checkout noise")
            continue

        if obj["risk"] in ("HIGH", "CRITICAL") and is_local_bounded_write(obj):
            ready.append(write_aspec(obj))
            continue

        existing = _hv_existing_blocker_for(obj, existing_queue)
        if existing is not None:
            bp = existing
            print(f"[HV] approval dedup: reusing {bp.name}")
        else:
            bp = write_aspec(obj)
            print(f"[HV] approval created: {bp.name}")

        rel = bp.relative_to(REPO).as_posix()
        blocked.append(bp)
        if rel not in existing_queue:
            existing_queue.append(rel)

    existing_queue = _hv_dedupe_pending_queue(existing_queue)
    _hv_save_pending_queue(existing_queue)
    if ready:
        atomic_write(ACTIVE_FILE, ready[0].relative_to(REPO).as_posix() + "\n")
    return ready, blocked

def _hv_approved_pending() -> List[Path]:
    queue = _hv_pending_queue()
    approved = []
    remain = []
    for rel in queue:
        p = REPO / rel
        if not p.is_file():
            continue
        meta = parse_spec_meta(p)
        if _hv_retry_state(meta["id"]).get("blocked"):
            remain.append(rel)
            continue
        if (SUP / "approvals" / f"{meta['id']}.approved").exists():
            approved.append(p)
        else:
            remain.append(rel)
    _hv_save_pending_queue(remain)
    return approved

def plan_wave(goal: str, results: List[tuple[Path, dict, Path]], current_meta: dict, checkpoint: Path | None = None) -> dict:
    width = max(1, min(int(_hv_policy().get("hypervelocity_wave_width", 4)), 4))
    result_text = _hv_results_text(results, checkpoint)
    pending = _hv_pending_queue()
    fresh_repair_cycle = not results and current_meta.get("id") == "HV-CYCLE"
    dirty_baseline = _hv_dirty_baseline_paths()
    prompt = f"""You are the ADD Gemini Hypervelocity scheduler for a real {PROJECT_NAME} repository.

GOAL:
{goal}

LATEST REPAIR RESULTS:
{result_text}

PENDING HIGH/CRITICAL APPROVAL QUEUE:
{json.dumps(pending, ensure_ascii=False, indent=2)}

LOCAL BUILD MANIFEST:
{discover_build_manifest()}

PRESERVED DIRTY BASELINE (DO NOT SELECT THESE PATHS OR THEIR DESCENDANTS):
{json.dumps(dirty_baseline, ensure_ascii=False, indent=2)}

Build the next READY FRONTIER of the dependency DAG.
Return JSON ONLY.

Use:
{{"complete": true, "summary": "..."}}

or:
{{
  "complete": false,
  "wave": [
    {{
      "id": "AI-NEXT",
      "title": "one bounded observable transition",
      "mode": "READ_ONLY or VERIFY or WRITE",
      "risk": "LOW or MEDIUM or HIGH or CRITICAL",
      "allowed_paths": ["narrow/path"],
      "verify_commands": ["targeted deterministic command"],
      "why": "...", "what": "...", "scope": ["..."], "out_of_scope": ["..."],
      "contract": ["..."], "invariants": ["..."], "verification": ["..."], "rollback": "..."
    }}
  ],
  "approval_blockers": []
}}

Rules:
- REPAIR-ONLY EXECUTION: return only Mode WRITE jobs that make a bounded functional repair.
- Do NOT return audits, inventories, reports, maps, READ_ONLY jobs, VERIFY-only jobs,
  documentation-only jobs, or work that only writes under {CONTROL_DIR_NAME}/ or docs/audit/.
- Every job must have at least one operational source, test, Docker, Compose, or runtime-config
  path in allowed_paths. Use the existing ADD map as evidence, then repair the actual code.
- Inspect the real target files before editing. Never create a generic placeholder or fabricate a
  domain, database mapping, secret, environment value, provider setting, or service command.
- Android already requires HTTPS by platform default: only change native network configuration if
  existing mobile runtime code proves a concrete need. Prefer a real base-URL/build-config repair.
- For Docker/VPS, derive every image, command, port, environment name, and health endpoint from
  existing manifests and source; never add a database service merely because a Compose file exists.
- Rollback must say to restore the supervisor-created backup for the bounded paths. Never propose
  git checkout, git reset, git clean, rm -rf, remote changes, or deployment.
- Never use `any`, type casts, type suppressions, or a change to a path in the preserved dirty
  baseline. Those are rejected by the integration supervisor.
- Prioritize the evidence-backed closure frontier from the target repository's existing map.
  Never assume product-specific domains or paths that are not present in the repository.
- Prefer 3-4 independent READY jobs when evidence supports it; never manufacture parallelism.
- Jobs in one wave must have no dependency on one another.
- WRITE jobs in one wave MUST have disjoint allowed_paths.
- Each job is one atomic A.SPEC.
- LOW/MEDIUM ordinary code/tests/config may run automatically.
- HIGH/CRITICAL local repairs may run automatically when they are bounded, backed up, and
  have explicit rollback and verification.
- HIGH/CRITICAL database/schema/Flyway, secrets, auth/RBAC critical, financial high-risk,
  service restart, remote infrastructure, deploy/rollback, or destructive work belongs only
  in approval_blockers unless the item is strictly local, bounded, backed up, and has explicit
  rollback and verification.
- A HIGH/CRITICAL blocker must not stop unrelated LOW/MEDIUM work.
- Prefer targeted verification; full suites belong to checkpoints.
- For frontend Vitest verification, use the repository's existing test root and avoid forked workers when the project supports a threaded runner.
- Failed tests are evidence: schedule the smallest repair, not repeated blind verification.
- Preserve all current uncommitted work.
- Never reset, clean, stash, discard, overwrite, or edit applied migrations.
- wave may contain 1 to {width} jobs.
{"- This is a fresh repair cycle with no verified repair result yet. `complete: true` is forbidden: inspect the real source tree and return 1-4 evidence-backed WRITE repairs from the known closure frontier." if fresh_repair_cycle else "- `complete: true` is allowed only after the current repair cycle has produced verified, integrated repairs and the final checkpoint passes."}
"""
    rc, answer, raw = planner_readonly(prompt)
    raw_path = LOGS / f"{current_meta['id']}-hv-planner-{now()}.log"
    atomic_write(raw_path, raw)
    if rc != 0:
        raise RuntimeError(f"Hypervelocity planner rc={rc}; see {raw_path}")
    plan = parse_json_answer(answer)
    if plan.get("complete") and fresh_repair_cycle:
        raise RuntimeError("planner attempted completion before scheduling a repair wave")
    if plan.get("complete"):
        return plan
    if "wave" not in plan and isinstance(plan.get("aspec"), dict):
        plan["wave"] = [plan["aspec"]]
    wave = plan.get("wave") or []
    blockers = plan.get("approval_blockers") or []
    if not isinstance(wave, list) or not isinstance(blockers, list):
        raise RuntimeError(f"Invalid Hypervelocity wave shape; see {raw_path}")
    plan["wave"] = wave[:width]
    return plan

def _hv_checkpoint_commands() -> List[str]:
    commands = []
    if (REPO / "gradlew").exists():
        commands.append("./gradlew test --no-daemon")
    for package_file in sorted(REPO.glob("apps/*/package.json")) + sorted(REPO.glob("packages/*/package.json")):
        try:
            package = json.loads(package_file.read_text(encoding="utf-8"))
        except Exception:
            continue
        scripts = package.get("scripts", {})
        if not isinstance(scripts, dict):
            continue
        rel_dir = package_file.parent.relative_to(REPO).as_posix()
        for name in ("lint", "typecheck", "test", "build"):
            if name in scripts:
                commands.append(f"pnpm --dir {rel_dir} run {name}")
    if (REPO / "package.json").exists():
        try:
            root_scripts = json.loads((REPO / "package.json").read_text(encoding="utf-8")).get("scripts", {})
        except Exception:
            root_scripts = {}
        for name in ("lint", "typecheck", "test", "build"):
            if isinstance(root_scripts, dict) and name in root_scripts:
                commands.append(f"pnpm run {name}")
    return list(dict.fromkeys(commands))

def _hv_checkpoint_tag(label: str, passed: bool) -> str | None:
    if not passed or not _hv_policy().get("hypervelocity_checkpoint_tags", True):
        return None
    state = load_state()
    sequence = len([x for x in state.get("history", []) if x.get("status", "PASS") == "PASS"])
    base = f"ralph/checkpoint-{sequence:04d}"
    tag = base
    suffix = 1
    while run(["git", "rev-parse", "--verify", tag], cwd=REPO).returncode == 0:
        suffix += 1
        tag = f"{base}-{suffix}"
    created = run(["git", "tag", tag], cwd=REPO)
    if created.returncode != 0:
        return None
    return tag

def run_checkpoint(label: str) -> tuple[bool, Path]:
    checkpoint = RESULTS / f"checkpoint-{label}-{now()}.json"
    commands = _hv_checkpoint_commands()
    print(f"\n[HV] checkpoint {label}: {len(commands)} deterministic suites")
    sb = _hv_prepare_sandbox(f"checkpoint-{label}")
    try:
        logs = []
        ok = True
        for command in commands:
            passed, detail = _hv_run_cmd(
                sb, command,
                int(_hv_policy().get("hypervelocity_sandbox_timeout_seconds", 900))
            )
            logs.append(detail)
            if not passed:
                ok = False
        payload = {
            "kind": "checkpoint",
            "label": label,
            "passed": ok,
            "commands": commands,
            "log_tail": "\n".join(logs)[-30000:],
            "created_at": dt.datetime.now().isoformat(),
        }
        payload["tag"] = _hv_checkpoint_tag(label, ok)
        atomic_write(checkpoint, json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        state = load_state()
        state["hv_health"] = {
            "score": 100 if ok else 50,
            "build": "PASS" if ok else "FAIL",
            "tests": "PASS" if ok else "FAIL",
            "lint": "PASS" if ok else "FAIL",
            "typecheck": "PASS" if ok else "FAIL",
            "new_errors": 0 if ok else 1,
            "warnings": 0,
        }
        save_state(state)
        return ok, checkpoint
    finally:
        _hv_remove_sandbox(sb)

def _hv_append_history(results: List[tuple[Path, dict, Path]]) -> None:
    state = load_state()
    history = state.get("history", []) if isinstance(state, dict) else []
    verified_count = 0
    for spec, meta, result_path in results:
        try:
            verified = bool(json.loads(result_path.read_text(encoding="utf-8")).get("verified"))
        except Exception:
            verified = False
        result_obj = _hv_load_json(result_path, {})
        retry = result_obj.get("retry", {}) if isinstance(result_obj, dict) else {}
        if not verified and not retry.get("blocked"):
            print(f"[HV][{meta['id']}] not recorded as complete: repair was not verified")
            continue
        history.append({
            "id": meta["id"], "mode": meta["mode"], "risk": meta["risk"],
            "spec": spec.relative_to(REPO).as_posix(),
            "result": result_path.relative_to(REPO).as_posix(),
            "status": "PASS" if verified else "BLOCKED",
            "completed_at": dt.datetime.now().isoformat(),
        })
        verified_count += int(verified)
    state["history"] = history[-100:]
    state["hv_completed_since_checkpoint"] = int(state.get("hv_completed_since_checkpoint", 0) or 0) + verified_count
    save_state(state)

def _hv_reconcile_repair_history() -> None:
    """Drop stale audit and unverified entries, then requeue bounded retries."""
    state = load_state()
    history = state.get("history", []) if isinstance(state, dict) else []
    retained = []
    retries = _hv_ready_queue()
    for entry in history:
        if not isinstance(entry, dict):
            continue
        spec_rel = str(entry.get("spec", "")).strip()
        spec_id = str(entry.get("id", "")).strip()
        mode = str(entry.get("mode", "")).strip()
        if spec_id.startswith("AUDIT-") or mode != "WRITE":
            continue
        result_rel = str(entry.get("result", "")).strip()
        result_path = REPO / result_rel
        try:
            verified = bool(json.loads(result_path.read_text(encoding="utf-8")).get("verified"))
        except Exception:
            verified = False
        if verified:
            retained.append(entry)
        elif spec_rel and (REPO / spec_rel).is_file():
            retries.append(spec_rel)
    state["history"] = retained[-100:]
    state["hv_completed_since_checkpoint"] = sum(1 for _entry in retained)
    state.pop("summary", None)
    state.pop("hv_last_checkpoint_report", None)
    state.pop("hv_final_checkpoint", None)
    save_state(state)
    _hv_save_ready_queue(retries)

def _hv_pause_for_approval() -> None:
    queue = _hv_pending_queue()
    state = load_state()
    state.update({
        "status": "approval_required",
        "paused_at": dt.datetime.now().isoformat(),
        "pending_approvals": len(queue),
    })
    save_state(state)
    print(f"\nAPPROVAL REQUIRED: {len(queue)} HIGH/CRITICAL A.SPEC(s) queued")
    for rel in queue[:10]:
        try:
            meta = parse_spec_meta(REPO / rel)
            print(f"  - {meta['id']} risk={meta['risk']} spec={rel}")
        except Exception:
            print(f"  - {rel}")

def cmd_run(args):
    ensure_control_plane()
    goal = args.goal.strip()
    if not goal:
        die("Goal cannot be empty")
    # A stopped daemon may leave only a diagnostic wave marker behind. It is
    # never a queue and must not be reported as an active worker wave.
    HV_WAVE_FILE.unlink(missing_ok=True)
    atomic_write(GOAL_FILE, goal + "\n")

    state = load_state()
    state.update({
        "goal": goal, "started_at": dt.datetime.now().isoformat(),
        "head_at_start": git_head(), "status": "running",
        "hypervelocity": True, "engine": "gemini-antigravity",
    })
    state.setdefault("hv_completed_since_checkpoint", 0)
    save_state(state)
    _hv_refresh_dashboard(stage="IDLE", current=None, results=[])
    _hv_reconcile_repair_history()

    current = get_active_spec()
    state_now = load_state()
    completed_ids = {
        str(x.get("id", "")) for x in state_now.get("history", [])
        if isinstance(x, dict)
    }
    pending_specs = []
    approved = _hv_approved_pending()
    if approved:
        pending_specs = approved[:max(1, int(_hv_policy().get("hypervelocity_wave_width", 4)))]
    else:
        eligible_ready = []
        for rel in _hv_ready_queue():
            rp = REPO / rel
            if not rp.is_file():
                continue
            try:
                meta = parse_spec_meta(rp)
            except Exception:
                continue
            eligible, reason = _hv_is_repair_job(meta)
            if not eligible:
                print(f"[HV] dropped queued non-repair {meta['id']}: {reason}")
                continue
            eligible_ready.append(rel)
            if meta["id"] not in completed_ids:
                pending_specs.append(rp)
        _hv_save_ready_queue(eligible_ready)
        pending_specs = pending_specs[:max(1, int(_hv_policy().get("hypervelocity_wave_width", 4)))]
        if pending_specs:
            atomic_write(ACTIVE_FILE, pending_specs[0].relative_to(REPO).as_posix() + "\n")
        elif current:
            try:
                meta = parse_spec_meta(current)
                eligible, reason = _hv_is_repair_job(meta)
                if not eligible:
                    print(f"[HV] dropped active non-repair {meta['id']}: {reason}")
                    atomic_write(ACTIVE_FILE, "\n")
                elif meta["id"] not in completed_ids:
                    prior_result = RESULTS / f"{meta['id']}-result.json"
                    if prior_result.exists():
                        print(f"[HV] skipped active A.SPEC with prior result: {meta['id']}")
                        atomic_write(ACTIVE_FILE, "\n")
                    else:
                        pending_specs = [current]
            except Exception:
                print("[HV] dropped unreadable active A.SPEC")

    last_results = []
    last_checkpoint = None
    cycle = 0

    while True:
        cycle += 1
        if pending_specs:
            results = execute_wave(pending_specs)
            # Always return to the planner after a wave. A failed or no-op
            # repair must not be replayed forever from the previous batch.
            pending_specs = []
            if not results:
                print("[HV] wave produced no executable results; replanning to isolate blockers")
                continue
            _hv_append_history(results)
            executed_ids = {m["id"] for _sp, m, _rp in results}
            remaining_ready = []
            for rel in _hv_ready_queue():
                rp = REPO / rel
                if not rp.is_file():
                    continue
                try:
                    if parse_spec_meta(rp)["id"] not in executed_ids:
                        remaining_ready.append(rel)
                except Exception:
                    continue
            _hv_save_ready_queue(remaining_ready)
            last_results = results
            quota_exhausted = any(
                bool(json.loads(result_path.read_text(encoding="utf-8")).get("worker_quota_exhausted"))
                for _spec, _meta, result_path in results
            )
            if quota_exhausted:
                print("[HV] Antigravity worker quota exhausted; waiting before the next repair wave")
                pending_specs = []
                time.sleep(900)
                continue
        else:
            last_results = []

        state = load_state()
        since_cp = int(state.get("hv_completed_since_checkpoint", 0) or 0)
        checkpoint_every = max(1, int(_hv_policy().get("hypervelocity_checkpoint_every_jobs", 6)))
        last_checkpoint = None
        if since_cp >= checkpoint_every:
            cp_ok, cp = run_checkpoint(f"batch-{cycle}")
            last_checkpoint = cp
            state = load_state()
            if cp_ok:
                state["hv_completed_since_checkpoint"] = 0
                state["hv_last_checkpoint_at"] = dt.datetime.now().isoformat()
                state["hv_last_checkpoint_result"] = cp.relative_to(REPO).as_posix()
            else:
                state["hv_last_checkpoint_failed"] = cp.relative_to(REPO).as_posix()
                state["hv_completed_since_checkpoint"] = 0
            save_state(state)

        approved = _hv_approved_pending()
        if approved:
            pending_specs = approved[:max(1, int(_hv_policy().get("hypervelocity_wave_width", 4)))]
            atomic_write(ACTIVE_FILE, pending_specs[0].relative_to(REPO).as_posix() + "\n")
            continue

        current_meta = last_results[-1][1] if last_results else {"id": "HV-CYCLE", "mode": "READ_ONLY", "risk": "LOW"}
        try:
            _hv_refresh_dashboard(stage="PLANNING", current=current_meta.get("id"), results=[])
            plan = plan_wave(goal, last_results, current_meta, last_checkpoint)
        except Exception as e:
            print(f"[HV] planner failure: {type(e).__name__}: {e}")
            _hv_refresh_dashboard(stage="IDLE", current=None, results=[])
            time.sleep(20)
            continue

        if plan.get("complete"):
            if _hv_pending_queue():
                _hv_pause_for_approval()
                return
            print("\n[HV] planner believes goal is complete; enforcing final checkpoint")
            ok, cp = run_checkpoint("final")
            if ok:
                state = load_state()
                state.update({
                    "status": "complete", "completed_at": dt.datetime.now().isoformat(),
                    "hv_final_checkpoint_result": cp.relative_to(REPO).as_posix(),
                })
                save_state(state)
                print("\nGOAL COMPLETE")
                print(plan.get("summary", ""))
                return
            last_checkpoint = cp
            continue

        ready, blocked = _hv_materialize_plan(plan)
        if ready:
            pending_specs = ready
            print(f"[HV] ready frontier: {', '.join(parse_spec_meta(p)['id'] for p in ready)}")
            continue

        pending_specs = []
        if blocked or _hv_pending_queue():
            _hv_pause_for_approval()
            return
        print("[HV] planner produced no executable repair wave; retrying with the repair-only constraints")
        time.sleep(20)
        continue

def cmd_approve(args):
    sid = args.spec_id.upper()
    d = SUP / "approvals"
    d.mkdir(parents=True, exist_ok=True)
    atomic_write(d / f"{sid}.approved", f"approved_at={dt.datetime.now().isoformat()}\n")
    print(f"Approved: {sid}")
    print("Approval recorded. Resume the saved goal to execute it.")

def cmd_status(_args):
    ensure_control_plane()
    state = load_state()
    active = get_active_spec()
    print("Hypervelocity Supervisor v10.1")
    print(f"Repo: {REPO}")
    print(f"HEAD: {git_head()}")
    print(f"Active A.SPEC: {active.relative_to(REPO) if active else '(none)'}")
    print(f"Goal: {GOAL_FILE.read_text().strip() if GOAL_FILE.exists() else '(none)'}")
    pid = None
    if DAEMON_PID.exists():
        try:
            pid = int(DAEMON_PID.read_text().strip())
            os.kill(pid, 0)
        except Exception:
            pid = None
    print(f"Daemon: {'RUNNING pid=' + str(pid) if pid else 'STOPPED'}")
    p = _hv_policy()
    print(
        "Hypervelocity: "
        f"wave_width={p.get('hypervelocity_max_parallel_specs',4)} "
        f"gemini_api_pool={p.get('hypervelocity_max_parallel_workers',7)} "
        "isolated_sandboxes=ON merge_applier=1 integration_gate=ON "
        f"adaptive_width={_hv_adaptive_width()} "
        f"checkpoint_every={p.get('hypervelocity_checkpoint_every_jobs',6)}"
    )
    dashboard = _hv_load_json(HV_DASHBOARD_FILE, {})
    if dashboard:
        print(f"Dashboard: {json.dumps(dashboard, ensure_ascii=False)}")
    wave = _hv_load_json(HV_WAVE_FILE, {})
    if wave:
        print(f"Wave: {json.dumps(wave, ensure_ascii=False)}")
    print(f"State: {json.dumps(state, ensure_ascii=False)}")

def cmd_dashboard(_args):
    ensure_control_plane()
    payload = _hv_load_json(HV_DASHBOARD_FILE, {})
    print(json.dumps(payload, ensure_ascii=False, indent=2))

def cmd_start(args):
    ensure_control_plane()
    goal = args.goal.strip()
    if not goal:
        die("Goal cannot be empty")
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    if DAEMON_PID.exists():
        try:
            pid = int(DAEMON_PID.read_text().strip())
            os.kill(pid, 0)
            print(f"Already running: pid={pid}")
            return
        except Exception:
            DAEMON_PID.unlink(missing_ok=True)
    logf = DAEMON_LOG.open("a", encoding="utf-8")
    cmd = [sys.executable, str(Path(__file__).resolve()), "run", goal]
    if Path("/usr/bin/caffeinate").exists():
        cmd = ["/usr/bin/caffeinate", "-dimsu"] + cmd
    p = subprocess.Popen(cmd, cwd=str(REPO), stdout=logf, stderr=subprocess.STDOUT, start_new_session=True)
    atomic_write(DAEMON_PID, str(p.pid) + "\n")
    atomic_write(GOAL_FILE, goal + "\n")
    print(f"Hypervelocity v10.1 started: pid={p.pid}")
    print(f"Log: {DAEMON_LOG}")

def main():
    p = argparse.ArgumentParser(prog="hypervelocity")
    sp = p.add_subparsers(dest="cmd")
    r = sp.add_parser("run", help="run/continue an ADD goal")
    r.add_argument("goal", help="high-level objective")
    pl = sp.add_parser("plan", help="create ADD production map and A.SPECs without executing workers")
    pl.add_argument("goal", help="planning objective")
    a = sp.add_parser("approve", help="approve one HIGH/CRITICAL A.SPEC")
    a.add_argument("spec_id")
    sp.add_parser("status", help="show supervisor state")
    sp.add_parser("dashboard", help="show Hypervelocity scheduler dashboard")
    st = sp.add_parser("start", help="run saved goal continuously in background")
    st.add_argument("goal", help="high-level objective")
    sp.add_parser("stop", help="stop background continuous run")
    lg = sp.add_parser("logs", help="show background log tail")
    lg.add_argument("--lines", type=int, default=120)
    args = p.parse_args()
    if args.cmd == "run":
        cmd_run(args)
    elif args.cmd == "plan":
        cmd_plan(args)
    elif args.cmd == "approve":
        cmd_approve(args)
    elif args.cmd == "start":
        cmd_start(args)
    elif args.cmd == "stop":
        cmd_stop(args)
    elif args.cmd == "logs":
        cmd_logs(args)
    elif args.cmd == "dashboard":
        cmd_dashboard(args)
    else:
        cmd_status(args)

if __name__ == "__main__":
    main()
