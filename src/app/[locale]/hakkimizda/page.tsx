import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/Reveal";
import Image from "next/image";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-20 px-6 bg-bone min-h-screen">
      <div className="max-w-7xl mx-auto w-full space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Reveal>
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">
                About Sunai / Hakkımızda
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
                {locale === "tr"
                  ? "Moda Estetiğini Yapay Zeka ile Yeniden Tanımlıyoruz"
                  : "Redefining Fashion Aesthetics with Artificial Intelligence"}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-sans text-stone text-sm leading-relaxed">
                {locale === "tr"
                  ? "Sunai Studio, lüks moda ve kreatif markaların vizyonlarını sınır olmadan gerçeğe dönüştürmek için kurulmuş gelecek nesil bir yapay zeka kreatif stüdyosudur. Geleneksel reklam prodüksiyonunun haftalar süren, yüksek maliyetli ve yorucu süreçlerini yapay zekanın gücüyle optimize ediyor; Paris sokaklarından İzlanda buzullarına kadar hayal ettiğiniz her mekanda koleksiyonlarınızı sergiliyoruz."
                  : "Sunai Studio is a next-generation AI creative studio established to bring the visions of luxury fashion and creative brands to life without boundaries. We optimize the weeks-long, expensive, and tedious processes of traditional advertising production with the power of AI, showcasing your collections in any setting you imagine, from the streets of Paris to the glaciers of Iceland."}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 relative aspect-square rounded-xl2 overflow-hidden border border-line/30 bg-cream">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Sunai Editorial Vision"
              fill
              sizes="(max-w-md) 100vw, (max-w-lg) 50vw, 400px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="bg-cream/45 border border-line/30 rounded-xl2 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal>
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">Misyonumuz / Mission</span>
              <h3 className="font-display text-xl font-bold text-ink">Sınırsız Yaratıcılık</h3>
              <p className="font-sans text-stone text-xs leading-relaxed">
                Moda ve tekstil markalarımızın tasarımlarını yüksek çözünürlükte, lüks editoryal kalitede ve konsept sınırı olmadan dünyaya açmak.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">Vizyonumuz / Vision</span>
              <h3 className="font-display text-xl font-bold text-ink">Apple Düzeyinde Titizlik</h3>
              <p className="font-sans text-stone text-xs leading-relaxed">
                Yapay zekanın teknik üstünlüğünü, minimalist ve göz alıcı bir tasarım diliyle birleştirerek lüks markalara yakışır prestijli sonuçlar üretmek.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-brass font-bold">Değerlerimiz / Values</span>
              <h3 className="font-display text-xl font-bold text-ink">Hızlı & Sürdürülebilir</h3>
              <p className="font-sans text-stone text-xs leading-relaxed">
                Seyahat, büyük stüdyo ekipleri ve lojistik maliyetlerini kaldırarak, günlerce süren post-prodüksiyon süreçlerini doğaya zarar vermeden tamamlamak.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
