import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDisplaySectors } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SectorCard from "@/components/SectorCard";

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const displaySectors = await getDisplaySectors();

  return (
    <div className="py-20 px-6 bg-bone min-h-screen">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        <div className="max-w-xl space-y-4">
          <Reveal>
            <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
              Sunai Studio / Portfolio
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink">
              {locale === "tr" ? "Seçkin Kampanyalarımız" : "Our Selected Campaigns"}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-sans text-stone text-sm leading-relaxed">
              {locale === "tr"
                ? "Yapay zekanın kreatif dehasıyla harmanlanmış, lüks segmentteki marka ortaklarımız için kurguladığımız görsel prodüksiyon ve kampanya portfolyomuz."
                : "Our visual production and campaign portfolio designed for our luxury segment brand partners, blended with the creative genius of AI."}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySectors.map((sector, idx) => (
            <Reveal key={sector.slug} delay={0.1 * idx}>
              <SectorCard sector={sector} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
