import { z } from "zod";

/** 問い合わせフォームの email フィールドと同一ルール */
export const emailFieldSchema = z
  .string()
  .min(1, "メールアドレスを入力してください")
  .email("有効なメールアドレスを入力してください");
