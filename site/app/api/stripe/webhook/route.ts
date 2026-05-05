import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe/client";
import { handleQuoteAccepted } from "@/lib/stripe/handlers/quote-accepted";
import { handleInvoicePaid } from "@/lib/stripe/handlers/invoice-paid";
import { handleInvoicePaymentFailed } from "@/lib/stripe/handlers/invoice-payment-failed";

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

  console.log("[stripe-webhook] Received event:", event.type, event.id);

  try {
    switch (event.type) {
      case "quote.accepted":
        await handleQuoteAccepted(event.data.object as Stripe.Quote);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log("[stripe-webhook] Unhandled event type:", event.type, event.id);
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] Handler error:", event.type, event.id, message);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
