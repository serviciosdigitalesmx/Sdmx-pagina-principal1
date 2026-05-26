import { Suspense } from "react";
import { RedirectToAdmin } from "./redirect-to-admin";

export default function OnboardingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen px-6 py-12 text-zinc-100"
          style={{
            background:
              "radial-gradient(circle_at_top,_rgba(180,83,9,0.14),_transparent_22%),radial-gradient(circle_at_80%_10%,_rgba(251,191,36,0.08),_transparent_24%),linear-gradient(180deg,#050505_0%,#0f0f10_46%,#141210_100%)",
          }}
        >
          Preparando tu panel...
        </div>
      }
    >
      <RedirectToAdmin />
    </Suspense>
  );
}
