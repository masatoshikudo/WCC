import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  partnerName: z.string().optional(),
  email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
  phone: z.string().min(1, "電話番号を入力してください"),
  weddingDateFirst: z.string().min(1, "希望日（第1候補）を選択してください"),
  weddingDateSecond: z.string().optional(),
  weddingDateThird: z.string().optional(),
  venue: z.string().optional(),
  guestCount: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(1, "ご相談内容を入力してください"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactFormDefaultValues: ContactFormValues = {
  name: "",
  partnerName: "",
  email: "",
  phone: "",
  weddingDateFirst: "",
  weddingDateSecond: "",
  weddingDateThird: "",
  venue: "",
  guestCount: "",
  budget: "",
  message: "",
};
