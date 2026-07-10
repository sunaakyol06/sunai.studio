import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/Reveal";
import { Sparkles, Zap, ShieldCheck, Video, Image as ImageIcon } from "lucide-react";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Services");

  const icons = [
    <ImageIcon className="w-6 h-6 text-brass" />,
    <Video className="w-6 h-6 text-brass" />,
    <Sparkles className="w-6 h-6 text-brass" />,
    <Zap className="w-6 h-6 text-brass" />,
    <ShieldCheck className="w-6 h-6 text-brass" />,
  ];

  return (
    <div className="py-20 px-6 bg-bone min-h-screen">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        <div className="max-w-xl space-y-4">
          <Reveal>
            <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
              Sunai Services / Çözümlerimiz
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-sans text-stone text-sm leading-relaxed">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Reveal key={i} delay={0.1 * i}>
              <div className="bg-cream/45 border border-line/35 p-8 rounded-xl2 hover:bg-cream/80 transition-all duration-300 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brass/10 flex items-center justify-center">
                    {icons[i - 1]}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {t(`service${i}`)}
                  </h3>
                  <p className="font-sans text-stone text-sm leading-relaxed">
                    {t(`service${i}Desc`)}
                  </p>
                </div>
                <div className="pt-6 border-t border-line/20">
                  <span className="font-mono text-[10px] tracking-widest text-brass uppercase font-bold">
                    0{i} / Premium Çözüm
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
