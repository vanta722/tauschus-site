import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const formType = String(formData.get("formType") ?? "unknown");
  const email = String(formData.get("email") ?? "");
  const payload = Object.fromEntries(formData.entries());

  // Send email notification via Resend
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "Therealvantaai@gmail.com",
      subject: `New signup on Tauschus.com — ${formType}`,
      html: `
        <h2>New submission from tauschus.com</h2>
        <p><strong>Form:</strong> ${formType}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>All fields:</strong></p>
        <pre>${JSON.stringify(payload, null, 2)}</pre>
      `,
    });
  } catch (error) {
    console.error("Resend error:", error);
  }

  // Also fire webhook if configured
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "tauschus-site", formType, payload }),
      });
    } catch (error) {
      console.error("Webhook error:", error);
    }
  }

  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = "/";
  redirectUrl.searchParams.set("submitted", "1");

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
