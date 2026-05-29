"use server";

import { getReceptionAvailability } from "@/lib/reception-capacity";

export async function fetchReceptionAvailability() {
  return getReceptionAvailability();
}
