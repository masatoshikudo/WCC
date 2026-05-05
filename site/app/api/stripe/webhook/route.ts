import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe/client";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const stripe = createStripeClient();
  if (!stripe) {
    console.error("[stripe-webhook] Stripe client not initialized");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  // Next.js 14: headers() is synchronous (Next.js 15+ requires await)
  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.warn("[stripe-webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] Signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Step 1: log only. Handlers for quote.accepted / invoice.paid etc. will be added in Step 2.
  console.log("[stripe-webhook] Received event:", event.type, event.id);

  return NextResponse.json({ received: true });
}
