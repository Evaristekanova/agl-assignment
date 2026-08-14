import type { NextApiRequest } from "next";

/**
 * Minimal in-memory rate limiter shared by the API routes (production
 * would use Redis or the platform's WAF). Keyed by caller-chosen key so
 * each endpoint gets its own budget per IP.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hitLog = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  max: number = MAX_PER_WINDOW,
  windowMs: number = WINDOW_MS
): boolean {
  const now = Date.now();
  const recent = (hitLog.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hitLog.set(key, recent);
  return recent.length > max;
}

export function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress ?? "unknown";
}
