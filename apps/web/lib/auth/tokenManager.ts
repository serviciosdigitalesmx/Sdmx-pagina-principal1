"use client";
const ACCESS_TOKEN_KEY = "sdmx.accessToken";
const REFRESH_TOKEN_KEY = "sdmx.refreshToken";

let memoryToken: string | null = null;
let memoryRefreshToken: string | null = null;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage(key: string): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(key);
}

function writeStorage(key: string, value: string | null): void {
  if (!canUseStorage()) return;
  if (value) {
    window.localStorage.setItem(key, value);
  } else {
    window.localStorage.removeItem(key);
  }
}

export function getToken(): string | null {
  return memoryToken ?? readStorage(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return memoryRefreshToken ?? readStorage(REFRESH_TOKEN_KEY);
}

export function setToken(token: string | null): void {
  memoryToken = token;
  writeStorage(ACCESS_TOKEN_KEY, token);
}

export function setRefreshToken(token: string | null): void {
  memoryRefreshToken = token;
  writeStorage(REFRESH_TOKEN_KEY, token);
}

export function clearToken(): void {
  memoryToken = null;
  writeStorage(ACCESS_TOKEN_KEY, null);
}

export function clearRefreshToken(): void {
  memoryRefreshToken = null;
  writeStorage(REFRESH_TOKEN_KEY, null);
}

export function clearAllTokens(): void {
  clearToken();
  clearRefreshToken();
}

export function hasToken(): boolean {
  return Boolean(getToken());
}
