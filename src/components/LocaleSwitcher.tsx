"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const nextLocale = locale === "tr" ? "en" : "tr";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="font-mono text-xs tracking-widest uppercase text-ink-soft hover:text-ink transition-colors cursor-pointer py-1 px-2 border border-line/45 hover:border-brass rounded bg-cream/50"
      aria-label="Switch language"
    >
      {locale === "tr" ? "EN" : "TR"}
    </button>
  );
}
