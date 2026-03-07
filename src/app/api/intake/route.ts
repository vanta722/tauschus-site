import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const formType = String(formData.get("formType") ?? "unknown");
  const payload = Object.fromEntries(formData.entries());

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: "tauschus-site", formType, payload }),
      });
    } catch (error) {
      console.error("Failed to send webhook", error);
    }
  } else {
    console.log("[LeadCapture]", payload);
  }

  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = "/";
  redirectUrl.searchParams.set("submitted", "1");

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
