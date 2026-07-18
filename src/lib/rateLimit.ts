import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;
const WINDOW_MINUTES = 15;

export async function checkLoginRateLimit(ipAddress: string) {
  const record = await prisma.loginAttempt.findUnique({ where: { ipAddress } });

  if (record?.blockedUntil && record.blockedUntil > new Date()) {
    const minutesLeft = Math.ceil((record.blockedUntil.getTime() - Date.now()) / 60000);
    return {
      allowed: false,
      message: `Too many login attempts. Please try again in ${minutesLeft} minute${
        minutesLeft === 1 ? "" : "s"
      }.`,
    };
  }

  return { allowed: true, message: "" };
}

// Call after a failed login attempt.
export async function recordFailedLogin(ipAddress: string) {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000);
  const existing = await prisma.loginAttempt.findUnique({ where: { ipAddress } });

  if (!existing || existing.lastAttemptAt < windowStart) {
    // First attempt, or the previous window has expired - reset the counter.
    await prisma.loginAttempt.upsert({
      where: { ipAddress },
      create: { ipAddress, attempts: 1, lastAttemptAt: new Date() },
      update: { attempts: 1, lastAttemptAt: new Date(), blockedUntil: null },
    });
    return;
  }

  const attempts = existing.attempts + 1;
  const blockedUntil =
    attempts > MAX_ATTEMPTS ? new Date(Date.now() + BLOCK_MINUTES * 60_000) : null;

  await prisma.loginAttempt.update({
    where: { ipAddress },
    data: { attempts, lastAttemptAt: new Date(), blockedUntil },
  });
}

// Call after a successful login to clear the counter.
export async function clearLoginAttempts(ipAddress: string) {
  await prisma.loginAttempt.deleteMany({ where: { ipAddress } });
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
