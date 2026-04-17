import { z } from "zod";

export const bookingCheckoutPayloadSchema = z.object({
  v: z.literal(1),
  email: z.string().email(),
  bookerName: z.string().max(120).nullable().optional(),
  weddingDate: z.string().max(32),
  dateUndecided: z.boolean(),
  planId: z.enum(["standard", "premium"]),
  planLabel: z.string().max(200),
  priceLabel: z.string().max(200),
  savedAt: z.number(),
});

export type BookingCheckoutPayload = z.infer<typeof bookingCheckoutPayloadSchema>;
