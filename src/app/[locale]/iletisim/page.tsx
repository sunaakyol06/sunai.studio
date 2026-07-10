import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getMergedSettings } from "@/lib/content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const settings = await getMergedSettings(locale);

  return (
    <div className="py-20 px-6 bg-bone min-h-screen">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <Reveal>
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                {t("title")}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
                {locale === "tr" ? "Görsel Standartlarınızı Yükseltin" : "Elevate Your Visual Standards"}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-sans text-stone text-sm leading-relaxed">
                {t("subtitle")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="space-y-6 font-sans text-sm text-stone border-t border-line/30 pt-8 max-w-sm">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brass block">
                  Genel İletişim / General Inquiries
                </span>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-ink hover:text-clay font-medium transition-colors text-base"
                >
                  {settings.email}
                </a>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brass block">
                  Telefon &amp; WhatsApp / Direct Line
                </span>
                <a
                  href={`tel:${settings.phone}`}
                  className="text-ink hover:text-clay font-medium transition-colors text-base"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brass block">
                  Stüdyo Merkezleri / Studios
                </span>
                <p className="text-ink font-medium text-base">
                  {settings.address}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 w-full">
          <Reveal delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
