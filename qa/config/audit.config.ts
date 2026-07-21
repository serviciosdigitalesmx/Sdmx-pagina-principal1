export type QaMode = "fast" | "full" | "functional" | "visual" | "performance" | "accessibility" | "seo" | "multitenant" | "stress";
export type QaTarget = "local" | "staging" | "production";

export type QaConfig = {
  mode: QaMode;
  target: QaTarget;
  baseUrls: {
    admin: string;
    public: string;
    clientes: string;
    api: string;
  };
  outputDir: string;
  screenshotsDir: string;
  videosDir: string;
  logsDir: string;
  resultsDir: string;
  reportsDir: string;
  desktopDir: string;
  recordVideoOnFailure: boolean;
  headless: boolean;
  credentials: Array<{ label: string; email: string; password: string }>;
};

const defaults = {
  admin: "https://admin.serviciosdigitalesmx.online",
  public: "https://app.serviciosdigitalesmx.online",
  clientes: "https://clientes.serviciosdigitalesmx.online",
  api: "https://api.serviciosdigitalesmx.online",
};

function normalizeUrl(value: string | undefined, fallback: string) {
  const input = (value ?? fallback).trim();
  const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  return url.toString().replace(/\/$/, "");
}

function envBool(name: string, fallback = false) {
  const raw = process.env[name];
  if (raw == null) return fallback;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

export function loadQaConfig(mode: QaMode = (process.env.QA_MODE as QaMode) ?? "fast"): QaConfig {
  const target = (process.env.QA_TARGET as QaTarget) ?? "production";
  const desktopDir = process.env.QA_DESKTOP_DIR?.trim() || process.env.FIXI_QA_OUTPUT_DIR?.trim() || "/Users/usuario/Desktop/Fixi-QA";

  return {
    mode,
    target,
    baseUrls: {
      admin: normalizeUrl(process.env.QA_ADMIN_URL ?? process.env.NEXT_PUBLIC_WEB_ADMIN_URL, defaults.admin),
      public: normalizeUrl(process.env.QA_PUBLIC_URL ?? process.env.NEXT_PUBLIC_WEB_PUBLIC_URL, defaults.public),
      clientes: normalizeUrl(process.env.QA_CLIENTES_URL ?? process.env.NEXT_PUBLIC_CUSTOMER_TRACKING_URL, defaults.clientes),
      api: normalizeUrl(process.env.QA_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_RENDER_API_URL, defaults.api),
    },
    outputDir: desktopDir,
    screenshotsDir: `${desktopDir}/screenshots`,
    videosDir: `${desktopDir}/videos`,
    logsDir: `${desktopDir}/logs`,
    resultsDir: `${desktopDir}/results`,
    reportsDir: `${desktopDir}/reports`,
    desktopDir,
    recordVideoOnFailure: envBool("QA_RECORD_VIDEO_ON_FAILURE", true),
    headless: envBool("QA_HEADLESS", true),
    credentials: [
      {
        label: "primary",
        email: process.env.QA_TEST_USER_EMAIL?.trim() || process.env.FIXI_QA_EMAIL?.trim() || "Srfix@gmail.com",
        password: process.env.QA_TEST_USER_PASSWORD?.trim() || process.env.FIXI_QA_PASSWORD?.trim() || "Coco9921",
      },
    ],
  };
}
