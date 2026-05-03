import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const formType = String(formData.get("formType") ?? "unknown");
  const email = String(formData.get("email") ?? "");
  const payload = Object.fromEntries(formData.entries());

  // Send admin notification
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
    console.error("Resend admin notification error:", error);
  }

  // Send welcome email to subscriber (WunToo beta only)
  if (formType === "wuntoo-beta" && email) {
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "You're In — WunToo Beta Access Confirmed",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WunToo — Beta Access</title>
</head>
<body style="margin:0;padding:0;background:#030303;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <div style="display:inline-block;padding:6px 16px;border:1px solid rgba(74,222,128,0.4);border-radius:2px;margin-bottom:24px;">
                <span style="color:#4ADE80;font-size:11px;letter-spacing:0.3em;font-weight:600;">BETA ACCESS CONFIRMED</span>
              </div>
              <h1 style="margin:0;font-size:52px;font-weight:900;letter-spacing:-1px;line-height:1;">
                <span style="background:linear-gradient(135deg,#B8860B 0%,#FFD700 40%,#FFFACD 60%,#D4AF37 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Wun</span><span style="color:rgba(232,232,232,0.9);">Too</span>
              </h1>
              <p style="color:rgba(232,232,232,0.35);font-size:11px;letter-spacing:0.3em;margin:12px 0 0;">MLB · NBA DUAL-MODEL INTELLIGENCE</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent);margin-bottom:40px;"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 0;">
              <p style="color:rgba(232,232,232,0.6);font-size:16px;line-height:1.8;margin:0 0 24px;">You’re in.</p>
              <p style="color:rgba(232,232,232,0.6);font-size:16px;line-height:1.8;margin:0 0 24px;">
                Every morning you’ll get today’s model output — the picks that cleared both signal filters, the games we passed on, and exactly why. No noise. No hype. Just the edge.
              </p>
              <p style="color:rgba(232,232,232,0.6);font-size:16px;line-height:1.8;margin:0 0 40px;">
                The record speaks for itself. Every bet logged before tip-off. Every result verified. We don’t delete losses.
              </p>

              <!-- Stats strip -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(212,175,55,0.15);border-radius:2px;background:rgba(255,255,255,0.02);margin-bottom:40px;">
                <tr>
                  <td align="center" style="padding:20px;border-right:1px solid rgba(212,175,55,0.1);">
                    <div style="color:rgba(212,175,55,0.5);font-size:10px;letter-spacing:0.25em;margin-bottom:6px;">MLB RECORD</div>
                    <div style="color:#FFD700;font-size:22px;font-weight:700;">7-5</div>
                  </td>
                  <td align="center" style="padding:20px;border-right:1px solid rgba(212,175,55,0.1);">
                    <div style="color:rgba(212,175,55,0.5);font-size:10px;letter-spacing:0.25em;margin-bottom:6px;">NBA RECORD</div>
                    <div style="color:#FFD700;font-size:22px;font-weight:700;">5-1</div>
                  </td>
                  <td align="center" style="padding:20px;">
                    <div style="color:rgba(212,175,55,0.5);font-size:10px;letter-spacing:0.25em;margin-bottom:6px;">NBA NET P&amp;L</div>
                    <div style="color:#4ADE80;font-size:22px;font-weight:700;">+$86.51</div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://tauschus.com/wuntoo" style="display:inline-block;background:linear-gradient(135deg,#B8860B,#FFD700);color:#000;font-size:13px;font-weight:700;letter-spacing:0.2em;padding:16px 40px;border-radius:2px;text-decoration:none;">VIEW TODAY’S PICKS →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.15),transparent);"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0;">
              <p style="color:rgba(232,232,232,0.15);font-size:11px;line-height:1.8;margin:0;">
                A <a href="https://tauschus.com" style="color:rgba(212,175,55,0.4);text-decoration:none;">Tauschus</a> product · Beta phase · Betting involves risk
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
    } catch (error) {
      console.error("Resend welcome email error:", error);
    }
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
