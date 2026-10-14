import { HomeB3 } from "@/components/home-b3/HomeB3";
import { getNextOpenMonth } from "@/lib/reception-capacity";

/** 残り枠を表示するため、1分ごとに作り直す */
export const revalidate = 60;

/** トップページ。デザインの元は docs/design/home/home-b3.html */
export default async function HomePage() {
  const openMonth = await getNextOpenMonth();
  return <HomeB3 openMonth={openMonth} />;
}
