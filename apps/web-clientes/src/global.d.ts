import { NormalizedAttachment as LibNormalizedAttachment } from "./lib/types";

declare global {
  type NormalizedAttachment = LibNormalizedAttachment;
}
