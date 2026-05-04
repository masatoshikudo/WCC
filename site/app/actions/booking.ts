"use server";

import { sendBookingConfirmationToCustomer } from "@/lib/email/customer-confirmation";
import { notifyOwnerOfBookingIntent } from "@/lib/email/booking-notification";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type RecordBookingIntentInput = {
  attemptId: string;
  email: string;
  bookerName: string | null;
  weddingDate: string;
  dateUndecided: boolean;
  venueName: string;
  venueArea: string;
  startTime: string;
  startTimeUndecided: boolean;
  coverageScope: "ceremony_only" | "ceremony_reception" | "through_afterparty";
  coupleName: string;
  timelineNote: string | null;
  requestedScenes: string | null;
  deliveryChannels: string[];
  referenceVideoUrls: string[];
  venueRestrictions: string | null;
  emergencyContact: string | null;
  planId: string;
  planLabel: string;
  priceLabel: string;
};

/** ステップ3送信時。同一 attemptId は無視 */
export async function recordBookingIntent(input: RecordBookingIntentInput): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.warn("[recordBookingIntent] Supabase not configured");
    return;
  }

  const row = {
    attempt_id: input.attemptId,
    email: input.email.trim(),
    booker_name: input.bookerName?.trim() || null,
    wedding_date: input.weddingDate,
    date_undecided: input.dateUndecided,
    venue_name: input.venueName.trim(),
    venue_area: input.venueArea.trim(),
    start_time: input.startTime,
    start_time_undecided: input.startTimeUndecided,
    coverage_scope: input.coverageScope,
    couple_name: input.coupleName.trim(),
    timeline_note: input.timelineNote?.trim() || null,
    requested_scenes: input.requestedScenes?.trim() || null,
    delivery_channels: input.deliveryChannels,
    reference_video_urls: input.referenceVideoUrls,
    venue_restrictions: input.venueRestrictions?.trim() || null,
    emergency_contact: input.emergencyContact?.trim() || null,
    plan_id: input.planId,
    plan_label: input.planLabel,
    price_label: input.priceLabel,
  };

  const { error } = await supabase.from("booking_intents").insert(row);

  if (error) {
    if (error.code === "23505") {
      return;
    }
    console.error("[recordBookingIntent]", error.message);
    return;
  }

  await notifyOwnerOfBookingIntent(input);
  await sendBookingConfirmationToCustomer(input);
}
