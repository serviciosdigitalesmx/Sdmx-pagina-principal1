import { mkdir, writeFile, readFile, rm, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname } from "node:path";

export async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

export async function ensureParent(path: string) {
  await ensureDir(dirname(path));
}

export async function writeText(path: string, content: string) {
  await ensureParent(path);
  await writeFile(path, content, "utf8");
}

export async function readText(path: string) {
  return readFile(path, "utf8");
}

export async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function removePath(path: string) {
  await rm(path, { force: true, recursive: true });
}

export function safeName(value: string) {
  return value.replace(/[^a-z0-9._-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
