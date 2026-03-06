import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";

export async function POST(req: Request) {
  const logPrefix = "[Didit Webhook]";

  try {
    // 1. Read raw body as text for HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature-v2");
    const webhookSecret = process.env.NEXT_PUBLIC_DIDIT_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        `${logPrefix} NEXT_PUBLIC_DIDIT_WEBHOOK_SECRET is not configured`,
      );
      return NextResponse.json({ received: true }, { status: 200 }); // Always 200 to stop Didit retries
    }

    // 2. Verify HMAC-SHA256 signature
    if (!signature) {
      console.warn(`${logPrefix} Missing x-signature-v2 header`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn(`${logPrefix} Invalid signature attempt`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 3. Parse payload
    const payload = JSON.parse(rawBody);
    const { session_id, status, vendor_data, decision } = payload;

    console.log(
      `${logPrefix} Valid webhook received for session ${session_id}, status: ${status}`,
    );
    console.log(
      `${logPrefix} Full webhook payload:`,
      JSON.stringify(payload, null, 2),
    );
    console.log(`${logPrefix} Extracted vendor_data:`, vendor_data);

    try {
      fs.appendFileSync(
        "./didit_debug.log",
        `[Webhook Received] ${new Date().toISOString()} | session_id: ${session_id} | status: ${status} | vendor_data: ${vendor_data}\n`,
      );
    } catch (e) {
      // ignore
    }

    // 4. Forward to Express backend
    const backendUrl = process.env.NEXT_PUBLIC_BASE_API;
    const internalToken = process.env.INTERNAL_BACKEND_TOKEN;

    if (backendUrl && internalToken) {
      try {
        const forwardRes = await fetch(`${backendUrl}/api/kyc/didit-webhook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${internalToken}`,
          },
          body: JSON.stringify({
            session_id,
            status,
            vendor_data,
            decision,
            // Include everything else just in case, but ensuring vendor_data is at the top level
            ...payload,
          }),
        });

        if (!forwardRes.ok) {
          const errorText = await forwardRes.text();
          console.error(
            `${logPrefix} Failed to forward to backend: ${forwardRes.status} ${errorText}`,
          );
        } else {
          console.log(`${logPrefix} Successfully forwarded to backend`);
        }
      } catch (err) {
        console.error(`${logPrefix} Error forwarding to backend:`, err);
      }
    } else {
      console.warn(
        `${logPrefix} Backend URL or internal token not configured for forwarding`,
      );
    }

    // Always return 200 to Didit
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error(`${logPrefix} Error processing webhook:`, error);
    // Still return 200 to prevent Didit from retrying infinitely on our parsing errors
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
