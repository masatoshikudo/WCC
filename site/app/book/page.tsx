import { BookCompletion } from "@/components/book/BookCompletion";
import { BookFlow } from "@/components/book/BookFlow";

type BookPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function pickParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function BookPage({ searchParams }: BookPageProps) {
  const payment = pickParam(searchParams.payment);
  const sessionId = pickParam(searchParams.session_id);

  if (payment === "success") {
    return <BookCompletion stripeCheckoutSessionId={sessionId ?? null} />;
  }

  return <BookFlow paymentState={payment === "cancel" ? "cancel" : "idle"} />;
}
