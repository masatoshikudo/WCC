import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/20 bg-bg-dark">
      <div className="mx-auto w-full max-w-content px-4 py-40 md:px-6 md:py-48 lg:px-8 lg:py-56">
        <section className="border-b border-white/20 pb-28 md:pb-32 md:text-center lg:pb-40">
          <h2 className="font-display text-[1.75rem] font-bold leading-tight text-white">
            永遠に残る思い出を捉える
          </h2>
          <p className="mt-3 max-w-2xl font-body leading-relaxed text-white/80 md:mx-auto">
            日程が未定でも、先にご相談いただけます。希望日と残したい瞬間を共有いただければ、対応範囲をご案内します。
            舞台裏のありのままの表情まで、何度でも追体験し、共有できます。
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:justify-center">
            <Link
              href="/book"
              className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
            >
              今すぐ予約する
            </Link>
          </div>
        </section>
        <p className="mt-24 font-body text-sm text-footer-muted md:mt-28 md:text-center lg:mt-32">
          © {new Date().getFullYear()} Wedding Content Creator. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
