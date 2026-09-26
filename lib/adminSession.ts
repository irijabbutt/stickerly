import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "stickerly_admin_session";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add a long random string as an environment variable " +
        "(e.g. `openssl rand -hex 32`)."
    );
  }
  return secret;
}

export function createSessionToken(): string {
  const expires = Date.now() + ADMIN_COOKIE_MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresStr, signature] = parts;
  if (role !== "admin") return false;

  let expected: string;
  try {
    expected = createHmac("sha256", getSecret()).update(`${role}.${expiresStr}`).digest("hex");
  } catch {
    return false;
  }

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return false;

  const expires = parseInt(expiresStr, 10);
  return !Number.isNaN(expires) && Date.now() <= expires;
}
