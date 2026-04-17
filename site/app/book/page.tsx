import { BookCompletion } from "@/components/book/BookCompletion";
import { BookFlow } from "@/components/book/BookFlow";

type BookPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function BookPage({ searchParams }: BookPageProps) {
  const raw = searchParams.payment;
  const payment = Array.isArray(raw) ? raw[0] : raw;

  if (payment === "success") {
    return <BookCompletion />;
  }

  return <BookFlow paymentState={payment === "cancel" ? "cancel" : "idle"} />;
}
