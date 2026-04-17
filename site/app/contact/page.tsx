import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-4 max-w-content px-4 py-10 md:mx-[200px] md:px-6 md:py-12 lg:px-8 lg:py-16">
      <h1 className="mt-3 font-display text-[1.75rem] font-bold text-ink">Let&apos;s get it booked...</h1>
      <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
        Social Sistersの問い合わせ導線を参考に、予約検討に必要な情報をまとめて送れるフォームにしています。分かる範囲で記入いただければOKです。
      </p>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <article className="bg-canvas-subtle p-4 md:p-5">
          <div className="relative overflow-hidden">
            <img
              src="https://images.squarespace-cdn.com/content/v1/67b4555002a42e199321ce7b/18ecda9e-8f28-4a2b-9ca3-3d0b0e82f878/The-Social-Sisters-Content-Creators-Social-Media-Creation-BTS-3.jpg?format=1500w"
              alt="Wedding content creator capturing moments with an iPhone"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4 space-y-4">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              WHAT TO SHARE
            </p>
            <ul className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・候補日（第1〜第3）</li>
              <li>・式場 / エリア、予定ゲスト人数</li>
              <li>・予算感、希望パッケージや参考URL</li>
            </ul>
          </div>
        </article>

        <div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
