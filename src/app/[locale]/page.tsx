import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDisplaySectors, getMergedSettings } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SectorCard from "@/components/SectorCard";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import { ArrowRight, Star, Sparkles, ShieldCheck, Zap, Video, Image as ImageIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function IndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const displaySectors = await getDisplaySectors();
  const settings = await getMergedSettings(locale);

  const stats = [
    { value: "50+", labelKey: "statsClients" },
    { value: "300+", labelKey: "statsProjects" },
    { value: "5+", labelKey: "statsExp" }
  ];

  const collabT = await getTranslations("Collaboration");

  const serviceIcons = [
    <ImageIcon key="1" className="w-5 h-5 text-brass" />,
    <Video key="2" className="w-5 h-5 text-brass" />,
    <Sparkles key="3" className="w-5 h-5 text-brass" />,
    <Zap key="4" className="w-5 h-5 text-brass" />,
    <ShieldCheck key="5" className="w-5 h-5 text-brass" />,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bone">
      {/* 1. HERO SECTION (Büyük Giriş Bölümü) */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden px-6">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-clay/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-brass/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-line/50">
                <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink font-bold">
                  {settings.hero.badge}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1]">
                {settings.hero.title}
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="font-sans text-stone text-base sm:text-lg max-w-xl leading-relaxed">
                {settings.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/calismalar"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-widest bg-clay text-bone hover:bg-clay-deep px-8 py-4 rounded-full font-bold transition-all duration-300 active:scale-[0.97] border border-clay hover:border-clay-deep shadow-md hover:shadow-lg"
                >
                  <span>{settings.hero.cta}</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/iletisim"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-sans text-xs uppercase tracking-widest bg-cream text-ink hover:bg-line/25 px-8 py-4 rounded-full font-bold transition-all duration-300 border border-line"
                >
                  {settings.logo} ile İletişim
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-line/40 max-w-lg">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="font-display text-3xl font-bold text-ink">
                      {stat.value}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-stone">
                      {collabT(stat.labelKey)}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Hero Premium Video or Image Mockup */}
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-xl2 overflow-hidden border border-line/40 shadow-kx-lg w-full max-w-lg mx-auto lg:mx-0">
            {settings.hero.mediaType === "video" ? (
              <video
                key={settings.hero.mediaUrl || settings.hero.mediaSrc}
                src={settings.hero.mediaUrl || settings.hero.mediaSrc}
                poster={settings.hero.mediaPoster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={settings.hero.mediaUrl || settings.hero.mediaSrc}
                alt={settings.hero.title}
                fill
                sizes="(max-w-md) 100vw, (max-w-lg) 50vw, 500px"
                className="object-cover object-center"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-mono text-[9px] tracking-widest text-brass uppercase font-bold">
                Sunai Creative Vision
              </span>
              <h3 className="font-display text-xl text-bone mt-1">
                Lüks Estetik & Sınırsız Mekân
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF MARQUEE */}
      <section className="py-6 overflow-hidden">
        <div className="relative w-full overflow-hidden border-y border-line/30 py-8 bg-cream/40 backdrop-blur-sm select-none">
          <div className="flex w-[200%] animate-marquee">
            <div className="flex justify-around w-1/2 font-mono text-[10px] sm:text-xs tracking-widest uppercase text-ink-soft/75">
              <span>Moda Markaları</span>
              <span>•</span>
              <span>Tekstil Kampanyaları</span>
              <span>•</span>
              <span>Tesettür Giyim Markaları</span>
              <span>•</span>
              <span>Gelinlik Firmaları</span>
              <span>•</span>
              <span>Takı &amp; Aksesuar</span>
              <span>•</span>
              <span>Kozmetik Markaları</span>
              <span>•</span>
              <span>Ayakkabı Markaları</span>
              <span>•</span>
            </div>
            <div className="flex justify-around w-1/2 font-mono text-[10px] sm:text-xs tracking-widest uppercase text-ink-soft/75">
              <span>Moda Markaları</span>
              <span>•</span>
              <span>Tekstil Kampanyaları</span>
              <span>•</span>
              <span>Tesettür Giyim Markaları</span>
              <span>•</span>
              <span>Gelinlik Firmaları</span>
              <span>•</span>
              <span>Takı &amp; Aksesuar</span>
              <span>•</span>
              <span>Kozmetik Markaları</span>
              <span>•</span>
              <span>Ayakkabı Markaları</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO/SHOWCASE (Sektörler) */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4 mb-16 text-center">
          <Reveal>
            <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
              {settings.showcaseHeader.title}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              {settings.showcaseHeader.title}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-sans text-stone text-sm max-w-xl mx-auto">
              {settings.showcaseHeader.subtitle}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displaySectors.map((sector, idx) => (
            <Reveal key={sector.slug} delay={0.1 * idx}>
              <SectorCard sector={sector} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-24 bg-cream/30 border-y border-line/40 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
            <div className="lg:col-span-6 space-y-4">
              <Reveal>
                <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                  {settings.servicesHeader.title}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
                  {settings.servicesHeader.title}
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={0.2}>
                <p className="font-sans text-stone text-sm leading-relaxed">
                  {settings.servicesHeader.subtitle}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {settings.services.map((service, idx) => (
              <Reveal key={service.id || idx} delay={0.1 * (idx + 1)}>
                <div className="bg-bone border border-line/30 p-8 rounded-xl2 hover:shadow-sm transition-all duration-300 space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-brass/10 flex items-center justify-center">
                      {serviceIcons[idx % serviceIcons.length]}
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {service.title}
                    </h3>
                    <p className="font-sans text-stone text-xs leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SUNAI STUDIO */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Reveal>
                <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                  {settings.whyUsHeader.title}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
                  {settings.whyUsHeader.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-sans text-stone text-sm leading-relaxed">
                  {settings.whyUsHeader.subtitle}
                </p>
              </Reveal>
            </div>

            <div className="space-y-6">
              {settings.whyUsReasons.map((reason, idx) => (
                <Reveal key={reason.id || idx} delay={0.1 * (idx + 1)}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-clay text-bone flex items-center justify-center font-mono text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display text-lg font-bold text-ink">
                        {reason.title}
                      </h4>
                      <p className="font-sans text-stone text-xs leading-relaxed max-w-md">
                        {reason.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Interactive Showcase: Before/After */}
          <div className="space-y-6 bg-cream/40 border border-line/40 p-8 rounded-xl2 relative overflow-hidden">
            <Reveal>
              <h3 className="font-display text-xl font-bold text-ink mb-2">
                {settings.beforeAfter.title}
              </h3>
              <p className="font-sans text-stone text-xs mb-6">
                {settings.beforeAfter.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {/* Before Mockup */}
                <div className="space-y-2">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-line/40 bg-bone flex items-center justify-center">
                    <Image
                      src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop"
                      alt="Raw sketch or product capture mockup"
                      fill
                      sizes="(max-w-md) 50vw, 200px"
                      className="object-cover opacity-60 filter grayscale"
                    />
                    <span className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-widest bg-ink text-bone py-1 px-2 rounded">
                      {settings.beforeAfter.original}
                    </span>
                  </div>
                </div>

                {/* After Mockup */}
                <div className="space-y-2">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-brass/50 bg-cream">
                    <Image
                      src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop"
                      alt="AI luxury enhanced mockup"
                      fill
                      sizes="(max-w-md) 50vw, 200px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-clay/35 to-transparent pointer-events-none" />
                    <span className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-widest bg-brass text-ink py-1 px-2 rounded font-bold">
                      {settings.beforeAfter.enhanced}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. WORKING PROCESS SECTION (Çalışma Süreci) */}
      <section className="py-24 bg-ink text-bone border-y border-line/10 relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-clay/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="space-y-4 mb-16 text-center max-w-xl mx-auto">
            <Reveal>
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                {settings.processHeader.title}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bone">
                {settings.processHeader.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-sans text-stone-soft text-sm">
                {settings.processHeader.subtitle}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {settings.processSteps.map((step, idx) => (
              <Reveal key={step.id || idx} delay={0.1 * (idx + 1)}>
                <div className="bg-ink-soft/40 border border-line/10 p-8 rounded-xl2 space-y-4 relative h-full flex flex-col justify-between hover:border-brass/30 transition-all duration-300">
                  <div className="space-y-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-brass block font-bold">
                      {step.badge}
                    </span>
                    <h3 className="font-display text-xl font-bold text-bone">
                      {step.title}
                    </h3>
                    <p className="font-sans text-stone-soft text-xs leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="w-8 h-[1px] bg-line/20 mt-6" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4 mb-16 text-center max-w-xl mx-auto">
          <Reveal>
            <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
              {settings.testimonialsHeader.title}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              {settings.testimonialsHeader.subtitle}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {settings.testimonials.map((t, idx) => (
            <Reveal key={t.id || idx} delay={0.1 * idx}>
              <div className="bg-cream/40 border border-line/40 p-8 rounded-xl2 h-full flex flex-col justify-between relative">
                <p className="font-sans italic text-ink-soft text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="font-display text-base font-bold text-ink">
                    {t.author}
                  </h4>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-stone mt-1">
                    {t.title}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-cream/20 border-t border-line/30 px-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className="space-y-4 mb-16 text-center">
            <Reveal>
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                {settings.faqsHeader.title}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
                {settings.faqsHeader.subtitle}
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6">
            {settings.faqs.map((faq, idx) => (
              <Reveal key={faq.id || idx} delay={0.1 * idx}>
                <div className="bg-bone border border-line/30 p-6 rounded-xl2">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">
                    {faq.q}
                  </h3>
                  <p className="font-sans text-stone text-xs sm:text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION (İletişim) */}
      <section id="contact" className="py-24 px-6 bg-bone">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Reveal>
                <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                  {settings.contactHeader.title}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
                  {settings.contactHeader.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-sans text-stone text-sm leading-relaxed">
                  {settings.contactHeader.subtitle}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="space-y-4 font-sans text-sm text-stone">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brass block mb-1">
                    E-posta / Email
                  </span>
                  <a href={`mailto:${settings.email}`} className="text-ink hover:text-clay font-medium transition-colors">
                    {settings.email}
                  </a>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brass block mb-1">
                    Telefon &amp; WhatsApp
                  </span>
                  <a href={`tel:${settings.phone}`} className="text-ink hover:text-clay font-medium transition-colors">
                    {settings.phone}
                  </a>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brass block mb-1">
                    Adres / Office
                  </span>
                  <p className="text-ink font-medium">
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
      </section>
    </div>
  );
}
