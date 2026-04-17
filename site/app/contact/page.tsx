import Link from "next/link";

import { ContactForm } from "@/components/contact/ContactForm";
import { SideColumnVisualPanel } from "@/components/layout/SideColumnVisualPanel";
import { TwoColumnCtaSection } from "@/components/layout/TwoColumnCtaSection";

export default function ContactPage() {
  return (
    <div className="mx-4 max-w-content px-4 py-10 md:mx-[200px] md:px-6 md:py-12 lg:px-8 lg:py-16">
      <h1 className="mt-3 font-display text-[1.75rem] font-bold text-ink">ご相談・お問い合わせ</h1>
      <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
        日程や会場が未定でも構いません。ご希望やご質問を、分かる範囲でお書きください。内容を確認のうえ、2営業日以内を目安に返信します。プランのお申し込みとお支払いは、
        <Link href="/packages" className="text-ink underline underline-offset-4 hover:opacity-80">
          料金ページ
        </Link>
        の内容をご確認のうえ、
        <Link href="/book" className="text-ink underline underline-offset-4 hover:opacity-80">
          ご予約
        </Link>
        からお手続きください。
      </p>

      <TwoColumnCtaSection
        leftAside={
          <SideColumnVisualPanel eyebrow="入力のヒント">
            <ul className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・挙式の候補日（複数あると助かります）</li>
              <li>・式場またはエリア、おおよその人数感</li>
              <li>・ご希望のプランや、気になる点・ご質問</li>
            </ul>
          </SideColumnVisualPanel>
        }
      >
        <ContactForm />
      </TwoColumnCtaSection>
    </div>
  );
}
