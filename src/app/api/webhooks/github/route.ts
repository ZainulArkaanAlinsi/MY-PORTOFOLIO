import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GitHub webhook endpoint: refreshes the cached homepage when repos change.
// Configure in GitHub: "Payload URL" -> <your-domain>/api/webhooks/github,
// content type application/json, and the same secret as env GITHUB_WEBHOOK_SECRET.
//
// GitHub signs every delivery with an HMAC-SHA256 of the raw body
// (`x-hub-signature-256: sha256=<hex>`). Anything unsigned or wrongly signed is
// rejected, and without a secret the endpoint stays closed, so nobody else can
// force revalidation.

function isValidSignature(body: Buffer, header: string | null, secret: string): boolean {
  if (!header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(`sha256=${createHmac("sha256", secret).update(body).digest("hex")}`);
  const received = Buffer.from(header);
  // timingSafeEqual throws on different lengths, and a length mismatch is already a failure.
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function POST(req: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Webhook is not configured" }, { status: 503 });
  }

  // Hash the exact bytes GitHub signed, not a re-encoded string.
  const body = Buffer.from(await req.arrayBuffer());
  if (!isValidSignature(body, req.headers.get("x-hub-signature-256"), secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  // GitHub sends a `ping` when the hook is created; there is nothing to refresh.
  if (req.headers.get("x-github-event") === "ping") {
    return NextResponse.json({ ok: true, revalidated: false });
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");

  return NextResponse.json({ ok: true, revalidated: true });
}
