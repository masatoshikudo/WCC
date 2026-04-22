import dynamic from "next/dynamic";

import { BookFlowLoading } from "@/components/book/BookFlowLoading";

const BookFlow = dynamic(() => import("@/components/book/BookFlow").then((m) => m.BookFlow), {
  loading: () => <BookFlowLoading />,
});

export default function BookPage() {
  return <BookFlow />;
}
