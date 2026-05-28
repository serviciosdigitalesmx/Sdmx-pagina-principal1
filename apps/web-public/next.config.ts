import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, "../..");

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
