import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactAlertInput {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

export async function sendContactAlert(input: ContactAlertInput) {
  const to = process.env.ADMIN_ALERT_EMAIL;
  if (!to) {
    console.warn("ADMIN_ALERT_EMAIL is not set - skipping email alert.");
    return { skipped: true };
  }

  try {
    const summary =
      input.message.length > 240 ? `${input.message.slice(0, 240)}...` : input.message;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to,
      subject: `New contact query: ${input.subject || input.name}`,
      html: `
        <div style="font-family: sans-serif; line-height:1.5;">
          <h2>New Contact Us submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
          ${input.subject ? `<p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(summary)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { skipped: false, error };
    }
    return { skipped: false, data };
  } catch (err) {
    // Never let an email failure break the contact form's success response.
    console.error("Failed to send contact alert email:", err);
    return { skipped: false, error: err };
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
