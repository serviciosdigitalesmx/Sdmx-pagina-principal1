import { CapacitorConfig } from "@capacitor/cli";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../..");
const envFiles = [resolve(root, ".env.local"), resolve(root, ".env.example")];

for (const file of envFiles) {
  if (existsSync(file)) {
    loadEnv({ path: file, override: false });
  }
}

const webUrl = (
  process.env.MOBILE_WEB_URL ||
  process.env.NEXT_PUBLIC_WEB_ADMIN_URL ||
  process.env.APP_URL ||
  ""
).trim();

const entryUrl = webUrl ? new URL("/login", webUrl).toString() : "";

const isDev = process.env.NODE_ENV !== "production";

if (!isDev && entryUrl) {
  const parsedUrl = new URL(entryUrl);
  if (parsedUrl.protocol !== "https:") {
    throw new Error(`Production mobile server URL must use HTTPS. Got: ${entryUrl}`);
  }
}

const config: CapacitorConfig = {
  appId: "mx.serviciosdigitalesmx.fixi",
  appName: "FIXI",
  webDir: "web",
  server: entryUrl
    ? {
        url: entryUrl,
        cleartext: /^http:\/\//i.test(entryUrl),
      }
    : undefined,
  android: {
    allowMixedContent: true,
  },
};

export default config;
