import { z } from "zod";

/** 決済完了画面・sessionStorage・Server Action 共通 */
export const bookingCheckoutPayloadSchema = z.object({
  v: z.literal(1),
  /** 同一予約試行を intent / payment / メールで突き合わせる ID */
  attemptId: z.string().uuid(),
  email: z.string().email(),
  bookerName: z.string().max(120).nullable().optional(),
  weddingDate: z.string().max(32),
  dateUndecided: z.boolean(),
  planId: z.literal("standard"),
  planLabel: z.string().max(200),
  priceLabel: z.string().max(200),
  savedAt: z.number(),
});

export type BookingCheckoutPayload = z.infer<typeof bookingCheckoutPayloadSchema>;
