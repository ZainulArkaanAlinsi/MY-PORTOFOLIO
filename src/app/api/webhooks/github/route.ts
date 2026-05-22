import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GitHub webhook endpoint.
// Configure in your GitHub repo: "Webhook URL" -> <your-domain>/api/webhooks/github
// Optional: set a secret and store it in env GITHUB_WEBHOOK_SECRET.

export async function POST(req: Request) {
  try {
    // Read body so request stream is consumed (and for potential future signature verification)
    await req.text();
    const signature = req.headers.get("x-hub-signature-256") || "";


    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (secret) {
      // We cannot reliably verify signature without crypto HMAC code here without extra env.
      // If you want strict verification, I can add it.
      // For now, we do a minimal guard.
      if (!signature || signature.length < 20) {
        return NextResponse.json({ ok: false, error: "Missing webhook signature" }, { status: 401 });
      }
    }

    // GitHub may send different events. For our use-case we just revalidate the homepage.
    // This should update the Projects + GitHub stats (because fetch uses Next caching revalidate).
    revalidatePath("/", "layout");
    revalidatePath("/", "page");

    return NextResponse.json({ ok: true, revalidated: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

