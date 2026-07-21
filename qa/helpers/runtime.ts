import { spawn } from "node:child_process";
import { ensureDir } from "./fs.js";
import { join } from "node:path";
import { promises as fs } from "node:fs";

export async function ensureDesktopStructure(desktopDir: string) {
  await Promise.all([
    ensureDir(desktopDir),
    ensureDir(join(desktopDir, "screenshots")),
    ensureDir(join(desktopDir, "videos")),
    ensureDir(join(desktopDir, "logs")),
    ensureDir(join(desktopDir, "results")),
    ensureDir(join(desktopDir, "reports")),
    ensureDir(join(desktopDir, "fixtures", "baselines")),
  ]);
}

export async function openPath(path: string) {
  const platform = process.platform;
  const command = platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";
  const args = platform === "win32" ? ["/c", "start", "", path] : [path];
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore", detached: true, shell: platform === "win32" });
    child.on("error", reject);
    child.unref();
    resolve();
  });
}

export async function newestFile(dir: string, predicate: (name: string) => boolean = () => true) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const candidates = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && predicate(entry.name))
      .map(async (entry) => {
        const fullPath = join(dir, entry.name);
        const stat = await fs.stat(fullPath);
        return { fullPath, mtimeMs: stat.mtimeMs };
      }),
  );
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0]?.fullPath ?? null;
}
