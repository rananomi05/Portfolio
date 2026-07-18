import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkLoginRateLimit, recordFailedLogin, clearLoginAttempts, getClientIp } from "@/lib/rateLimit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  try {
    // 1. IP rate limit check - happens before anything else touches the DB or Supabase.
    const rateLimit = await checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.message }, { status: 429 });
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, recaptchaToken } = parsed.data;

    // 2. reCAPTCHA v3 verification, server-side only.
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 0.5);
    if (!recaptchaResult.success) {
      await recordFailedLogin(ip);
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please refresh and try again." },
        { status: 400 }
      );
    }

    // 3. Attempt Supabase Auth sign-in. Generic error message avoids leaking
    //    whether the email exists.
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      await recordFailedLogin(ip);

      // Supabase returns a distinct message when the account exists but its
      // email hasn't been confirmed yet - surface that specifically so the
      // Admin knows to check their inbox instead of assuming a wrong password.
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return NextResponse.json(
          {
            error:
              "This email hasn't been verified yet. Check your inbox for the confirmation link before logging in.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await clearLoginAttempts(ip);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
