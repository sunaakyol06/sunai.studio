import { notFound } from "next/navigation";
import { getDisplaySector, getMergedSettings } from "@/lib/content";
import { sectorSlugs } from "@/data/sectors";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import MediaGrid from "@/components/MediaGrid";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const dynamicParams = true;

export function generateStaticParams() {
  return sectorSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const sector = await getDisplaySector(slug);
  if (!sector) return {};

  const name = sector.name[locale as "tr" | "en"] || sector.name.tr;
  const tagline = sector.tagline[locale as "tr" | "en"] || sector.tagline.tr;

  return {
    title: name,
    description: tagline,
  };
}

export default async function SectorDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const sector = await getDisplaySector(slug);
  const settings = await getMergedSettings(locale);
  if (!sector) {
    notFound();
  }

  const name = sector.name[locale as "tr" | "en"];
  const tagline = sector.tagline[locale as "tr" | "en"];

  return (
    <div className="py-20 px-6 bg-bone min-h-screen">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        <Reveal>
          <Link
            href="/calismalar"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-stone hover:text-ink transition-colors"
          >
            <ArrowLeft size={12} className="w-3 h-3" />
            <span>Koleksiyonlara Dön / Back to Collections</span>
          </Link>
        </Reveal>

        <div className="max-w-3xl space-y-4">
          <Reveal delay={0.1}>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: sector.accent || "var(--color-brass)" }}
              />
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                Koleksiyon Detay / Collection Details
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
              {name}
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="font-sans text-stone text-base sm:text-lg leading-relaxed">
              {tagline}
            </p>
          </Reveal>
        </div>

        <MediaGrid media={sector.media} />

        <Reveal>
          <div
            className="border-t border-line/30 pt-16 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ borderColor: `${sector.accent}30` }}
          >
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-display text-lg font-bold text-ink">
                Markanız için premium bir kampanya mı tasarlamak istiyorsunuz?
              </h4>
              <p className="font-sans text-xs text-stone">
                Bizimle iletişime geçin, vizyonunuzu yapay zekanın gücüyle lüks standartlarda canlandıralim.
              </p>
            </div>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-bone hover:opacity-90 px-8 py-4 rounded-full font-bold transition-all duration-300 active:scale-[0.97]"
              style={{ backgroundColor: sector.accent || "var(--color-clay)" }}
            >
              <span>{settings.hero.cta || "Proje Başlat / Start Project"}</span>
              <ArrowRight size={14} className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
