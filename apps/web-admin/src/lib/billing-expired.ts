"use client";

const BILLING_EXPIRED_KEY = "srf_billing_expired";
const BILLING_EXPIRED_EVENT = "srf:billing-expired";

// 🔓 BILLING DISABLED — Fixi is free-to-use until further notice (2026-07-29)
export function isBillingExpired(): boolean {
  // Always clear any stale billing-expired flag and return false
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(BILLING_EXPIRED_KEY);
  }
  return false;
}

export function setBillingExpiredState(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(BILLING_EXPIRED_KEY, "true");
  } else {
    window.localStorage.removeItem(BILLING_EXPIRED_KEY);
  }
  window.dispatchEvent(new CustomEvent(BILLING_EXPIRED_EVENT, { detail: value }));
}

export function clearBillingExpiredState() {
  setBillingExpiredState(false);
}

export function onBillingExpired(listener: (expired: boolean) => void) {
  const handler = (event: Event) => {
    const custom = event as CustomEvent<boolean>;
    listener(Boolean(custom.detail));
  };

  window.addEventListener(BILLING_EXPIRED_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(BILLING_EXPIRED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

