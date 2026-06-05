"use client";

import { resolveSharedCookieDomain } from "@white-label/config";

export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "app_auth_token";
const AUTH_TOKEN_KEYS = Array.from(new Set([AUTH_TOKEN_KEY, "app_auth_token", "auth_token"]));
const AUTH_COOKIE_NAME = AUTH_TOKEN_KEY;
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getCookieHost() {
  return typeof window !== "undefined" ? window.location.hostname : undefined;
}

function getCookieDomain() {
  return resolveSharedCookieDomain(getCookieHost());
}

function getCookieAttributes(persistent: boolean) {
  const attrs = [
    `Path=/`,
    `SameSite=None`,
    `Secure`,
    persistent ? `Max-Age=${AUTH_COOKIE_MAX_AGE}` : undefined,
    getCookieDomain() ? `Domain=${getCookieDomain()}` : undefined,
  ].filter(Boolean);

  return attrs.join("; ");
}

function writeCookie(token: string, persistent: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; ${getCookieAttributes(persistent)}`;
}

function clearCookie() {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=None; Secure${getCookieDomain() ? `; Domain=${getCookieDomain()}` : ""}`;
}

function writeToken(token: string, persistent: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  const primaryStorage = persistent ? window.localStorage : window.sessionStorage;
  const secondaryStorage = persistent ? window.sessionStorage : window.localStorage;

  for (const key of AUTH_TOKEN_KEYS) {
    primaryStorage.setItem(key, token);
    secondaryStorage.removeItem(key);
  }

  writeCookie(token, persistent);
}

export function saveAuthToken(token: string, persistent = true) {
  writeToken(token, persistent);
}

export function readAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of AUTH_TOKEN_KEYS) {
    const persistentValue = window.localStorage.getItem(key);
    if (persistentValue) {
      return persistentValue;
    }

    const sessionValue = window.sessionStorage.getItem(key);
    if (sessionValue) {
      return sessionValue;
    }
  }

  const cookieValue = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (cookieValue) {
    return decodeURIComponent(cookieValue);
  }

  return null;
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of AUTH_TOKEN_KEYS) {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }

  clearCookie();
}
