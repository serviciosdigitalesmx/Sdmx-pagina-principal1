import type { NormalizedAttachment as LocalNormalizedAttachment } from "./lib/types";

declare global {
  type NormalizedAttachment = LocalNormalizedAttachment;

  interface Object {
    orderStatusLabel?: string;
  }
}
