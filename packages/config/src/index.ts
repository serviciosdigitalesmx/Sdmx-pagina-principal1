const fail = (name: string): never => {
  throw new Error(`Missing required environment variable: ${name}`);
};

export function requireEnv(name: string): string {
  switch (name) {
    case "NEXT_PUBLIC_API_URL":
      return process.env.NEXT_PUBLIC_API_URL?.trim() || fail(name);

    case "NEXT_PUBLIC_API_BASE_URL":
      return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || fail(name);

    case "NEXT_PUBLIC_RENDER_API_URL":
      return process.env.NEXT_PUBLIC_RENDER_API_URL?.trim() || fail(name);

    default: {
      const value = process.env[name]?.trim();
      if (!value) return fail(name);
      return value;
    }
  }
}

export function optionalEnv(name: string): string | null {
  switch (name) {
    case "NEXT_PUBLIC_API_URL":
      return process.env.NEXT_PUBLIC_API_URL?.trim() || null;

    case "NEXT_PUBLIC_API_BASE_URL":
      return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || null;

    case "NEXT_PUBLIC_RENDER_API_URL":
      return process.env.NEXT_PUBLIC_RENDER_API_URL?.trim() || null;

    default:
      return process.env[name]?.trim() || null;
  }
}

export function resolveApiBaseUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_RENDER_API_URL,
  ].filter((value): value is string => Boolean(value?.trim()));

  if (candidates.length === 0) {
    return fail("NEXT_PUBLIC_API_URL");
  }

  try {
    return new URL(candidates[0]).toString().replace(/\/$/, "");
  } catch {
    throw new Error("Invalid API base URL in environment");
  }
}
