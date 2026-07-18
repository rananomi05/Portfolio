// Verifies a Google reCAPTCHA v3 token server-side.
// v3 returns a score (0.0 = bot, 1.0 = human) instead of a checkbox challenge.
export async function verifyRecaptcha(token: string | undefined, minScore = 0.5) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    // No reCAPTCHA keys configured yet (e.g. local dev before setup) - don't
    // block login/contact on something that isn't wired up.
    console.warn("RECAPTCHA_SECRET_KEY is not set - skipping verification.");
    return { success: true, score: 1, reason: "skipped-no-secret" };
  }

  // Secret IS configured, so a token is now mandatory - a missing token here
  // means the client-side widget failed or was bypassed.
  if (!token) return { success: false, score: 0, reason: "missing-token" };

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();

    if (!data.success) {
      return { success: false, score: 0, reason: "verification-failed" };
    }
    if (typeof data.score === "number" && data.score < minScore) {
      return { success: false, score: data.score, reason: "low-score" };
    }
    return { success: true, score: data.score ?? 1, reason: "ok" };
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return { success: false, score: 0, reason: "network-error" };
  }
}
