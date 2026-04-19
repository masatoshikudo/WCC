import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    /** `className={定数}` だけのユーティリティは、定義元ファイルを走査しないと生成されない */
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas-rgb) / <alpha-value>)",
        "canvas-subtle": "var(--color-canvas-subtle)",
        "canvas-warm": "var(--color-canvas-warm)",
        ink: "var(--color-ink-heading)",
        "ink-body": "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        "ink-subtle": "var(--color-ink-subtle)",
        "bg-dark": "var(--color-bg-dark)",
        "text-on-dark": "var(--color-text-on-dark)",
        "footer-muted": "var(--color-footer-muted)",
        "footer-link": "var(--color-footer-link)",
        "footer-sub-link": "var(--color-footer-sub-link)",
        "footer-nav-link": "var(--color-footer-nav-link)",
        link: "var(--color-link)",
        hairline: "var(--color-border-hairline)",
        strong: "var(--color-border-strong)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        danger: "var(--color-danger)",
        success: "var(--color-success)",
        "on-accent": "var(--color-on-accent)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        full: "var(--radius-full)",
      },
      maxWidth: {
        content: "1200px",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "ui-serif", "Georgia", "serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
