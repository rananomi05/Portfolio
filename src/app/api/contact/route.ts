import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { sendContactAlert } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, subject, message, recaptchaToken } = parsed.data;

    // Server-side reCAPTCHA v3 check - never trust the client alone.
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: "We couldn't verify you're human. Please refresh and try again." },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        status: "PENDING",
      },
    });

    // Email failures never break the success response for the visitor.
    await sendContactAlert({ name, email, subject, message });

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch (err) {
    console.error("Contact submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
