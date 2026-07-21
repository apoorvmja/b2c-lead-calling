/* eslint-disable turbo/no-undeclared-env-vars */
import type { UserRole } from "@repo/shared";

export const USER_COOKIE_NAME = "b2c-calling-user-cookie";

export type AuthCookieUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

function base64UrlEncode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");

  return atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
}

async function createCookieSignature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return base64UrlEncode(new Uint8Array(signature));
}

export async function getUserFromToken(token?: string) {
  const cookieSecret = process.env.COOKIE_SECRET;
  const [payload, signature] = token?.split(".") ?? [];

  if (!cookieSecret || !payload || !signature) {
    return null;
  }

  if (signature !== (await createCookieSignature(payload, cookieSecret))) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as AuthCookieUser;
  } catch {
    return null;
  }
}

export async function getRoleFromToken(token?: string) {
  return (await getUserFromToken(token))?.role ?? null;
}
