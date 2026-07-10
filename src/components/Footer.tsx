"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { MergedSettings } from "@/lib/content";

interface FooterProps {
  settings: MergedSettings;
}

export default function Footer({ settings }: FooterProps) {
  const t = useTranslations("Footer");
  const navT = useTranslations("Nav");

  const logoText = settings.logo || "sunai.studio";
  const addressText = settings.address || t("address");
  const emailVal = settings.email || "hello@sunai.studio";
  const phoneVal = settings.phone || "+905300000000";

  return (
    <footer className="bg-ink text-bone pt-16 pb-8 border-t border-line/10 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-clay/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-display text-3xl font-bold tracking-tight text-bone hover:text-brass transition-colors duration-300 block mb-4"
            >
              {logoText}
            </Link>
            <p className="font-sans text-stone-soft max-w-sm text-sm leading-relaxed mb-6">
              {t("tagline")}
            </p>
            <div className="text-xs font-mono uppercase tracking-widest text-brass">
              {addressText}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-brass mb-4">
              {t("links")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="font-sans text-sm text-stone-soft hover:text-bone transition-colors duration-300"
                >
                  {navT("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/calismalar"
                  className="font-sans text-sm text-stone-soft hover:text-bone transition-colors duration-300"
                >
                  {navT("work")}
                </Link>
              </li>
              <li>
                <Link
                  href="/hizmetler"
                  className="font-sans text-sm text-stone-soft hover:text-bone transition-colors duration-300"
                >
                  {navT("services")}
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="font-sans text-sm text-stone-soft hover:text-bone transition-colors duration-300"
                >
                  {navT("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-brass mb-4">
              {t("contact")}
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href={`mailto:${emailVal}`}
                  className="font-sans text-sm text-stone-soft hover:text-bone transition-colors duration-300"
                >
                  {emailVal}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phoneVal}`}
                  className="font-sans text-sm text-stone-soft hover:text-bone transition-colors duration-300"
                >
                  {phoneVal}
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              {Object.entries(settings.socials || {}).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-stone-soft hover:text-brass transition-colors duration-300"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-line/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-stone-soft/60">
            &copy; {new Date().getFullYear()} {logoText}. {t("rights")}
          </p>
          <div className="font-mono text-[10px] tracking-widest text-stone-soft/40 uppercase">
            Designed to wow
          </div>
        </div>
      </div>
    </footer>
  );
}
