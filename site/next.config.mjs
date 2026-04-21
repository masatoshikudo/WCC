import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";

/**
 * `NEXT_DIST_DIR` があれば最優先。
 * 未設定かつ `next dev`（NODE_ENV=development）のときは、Dropbox 同期で壊れにくいよう
 * プロジェクト外の一時ディレクトリに dist を置く（`NEXT_DEV_DIST_IN_PROJECT=1` で従来の .next に戻す）。
 */
function resolveDistDir() {
  const explicit = process.env.NEXT_DIST_DIR?.trim();
  if (explicit) return explicit;

  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_DEV_DIST_IN_PROJECT !== "1"
  ) {
    const slug = crypto
      .createHash("sha1")
      .update(process.cwd())
      .digest("hex")
      .slice(0, 16);
    return path.join(os.tmpdir(), "wcc-next-dev", slug);
  }

  return undefined;
}

const distDir = resolveDistDir();

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(distDir ? { distDir } : {}),
  async redirects() {
    /** フラグメントは `lib/site-links.ts` の `HOME_ANCHOR_HREF` と一致させる */
    return [
      { source: "/packages", destination: "/#pricing", permanent: true },
      { source: "/portfolio", destination: "/#highlights", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
    ];
  },
  webpack: (config, { dev }) => {
    // Dropbox 配下だと `.next/cache/webpack/*.pack.gz` が同期・削除され ENOENT になり、
    // CSS/フォント/chunk が 404・白画面になることがある。開発時のみファイルキャッシュを切る。
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
