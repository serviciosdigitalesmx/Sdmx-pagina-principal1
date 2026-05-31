declare module "next-pwa" {
  import type { NextConfig } from "next";

  type PwaOptions = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: Array<Record<string, unknown>>;
  };

  export default function withPWA(options: PwaOptions): (config: NextConfig) => NextConfig;
}

