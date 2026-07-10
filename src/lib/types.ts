export interface AddedMedia {
  id: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  ratio?: "9:16" | "1:1" | "4:5" | "3:4" | "16:9";
  title: string;
}

export interface SectorOverride {
  order: string[];
  hidden: string[];
  titles?: Record<string, string>;
  added?: AddedMedia[];
}

export interface CustomSector {
  slug: string;
  name: string;
  tagline: string;
  cover: string;
  accent: string;
}

export interface SiteSettings {
  logo: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  socials: {
    instagram: string;
    vimeo: string;
    youtube: string;
  };
  hero: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
    cta: { tr: string; en: string };
    badge: { tr: string; en: string };
    mediaType: "video" | "image";
    mediaSrc: string;
    mediaPoster?: string;
  };
  showcaseHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
  };
  servicesHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
  };
  services: {
    id: string;
    title: { tr: string; en: string };
    desc: { tr: string; en: string };
  }[];
  whyUsHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
    heading: { tr: string; en: string };
  };
  whyUsReasons: {
    id: string;
    title: { tr: string; en: string };
    desc: { tr: string; en: string };
  }[];
  beforeAfter: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
    original: { tr: string; en: string };
    enhanced: { tr: string; en: string };
  };
  processHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
    heading: { tr: string; en: string };
  };
  processSteps: {
    id: string;
    badge: { tr: string; en: string };
    title: { tr: string; en: string };
    desc: { tr: string; en: string };
  }[];
  testimonialsHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
  };
  testimonials: {
    id: string;
    quote: { tr: string; en: string };
    author: string;
    title: { tr: string; en: string };
  }[];
  faqsHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
  };
  faqs: {
    id: string;
    q: { tr: string; en: string };
    a: { tr: string; en: string };
  }[];
  contactHeader: {
    title: { tr: string; en: string };
    subtitle: { tr: string; en: string };
    heading: { tr: string; en: string };
  };
}

export interface Store {
  overrides: Record<string, SectorOverride>;
  custom: CustomSector[];
  settings?: SiteSettings;
}

export function getDefaultSettings(): SiteSettings {
  return {
    logo: "sunai.studio",
    whatsapp: "+905300000000",
    phone: "+905300000000",
    email: "hello@sunai.studio",
    address: "Kreatif Merkez: İstanbul / Paris",
    socials: {
      instagram: "https://instagram.com/sunai.studio",
      vimeo: "https://vimeo.com/sunai",
      youtube: "https://youtube.com/@sunai.studio"
    },
    hero: {
      title: {
        tr: "Lüks Moda Markaları İçin Yapay Zekâ Görsel Prodüksiyonu",
        en: "Luxury AI Visual Production for Fashion Brands"
      },
      subtitle: {
        tr: "Kusursuz estetik, sınırsız mekân ve üst düzey kreatif vizyon. Kampanyalarınızı, kataloglarınızı ve ticari videolarınızı yapay zekânın gücüyle lüks standartlarda yeniden tanımlıyoruz.",
        en: "Impeccable aesthetics, infinite locations, and high-end creative vision. We redefine your campaigns, lookbooks, and commercial videos to luxury standards using the power of AI."
      },
      cta: {
        tr: "Koleksiyonu Keşfet",
        en: "Explore Collections"
      },
      badge: {
        tr: "YAPAY ZEKÂ KREATİF STÜDYOSU",
        en: "AI CREATIVE STUDIO"
      },
      mediaType: "image",
      mediaSrc: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
    },
    showcaseHeader: {
      title: {
        tr: "Showcase / Portfolyo",
        en: "Showcase / Portfolio"
      },
      subtitle: {
        tr: "Lüks moda, mücevher ve kozmetik markaları için yapay zeka ile hayata geçirdiğimiz reklam ve kampanya çalışmaları.",
        en: "AI-powered campaigns and editorial lookbooks designed for high-end fashion, jewelry, and cosmetics brands."
      }
    },
    servicesHeader: {
      title: {
        tr: "Hizmetlerimiz",
        en: "Our Services"
      },
      subtitle: {
        tr: "Markanızın prestijini en üst seviyeye taşıyacak dijital sanat ve prodüksiyon çözümleri.",
        en: "Digital art and production solutions designed to elevate your brand's prestige to the highest tier."
      }
    },
    services: [
      {
        id: "service-1",
        title: { tr: "AI Ürün Fotoğrafçılığı", en: "AI Product Photography" },
        desc: {
          tr: "Kozmetik, mücevher ve hazır giyim ürünleriniz için stüdyo maliyeti olmadan, dünyanın en prestijli mekanlarında yüksek çözünürlüklü sanatsal çekimler.",
          en: "High-resolution artistic shoots for cosmetics, jewelry, and ready-to-wear products in the world's most prestigious locations—without the cost of physical studios."
        }
      },
      {
        id: "service-2",
        title: { tr: "AI Reklam Videoları", en: "AI Commercial Videos" },
        desc: {
          tr: "Moda markaları için sinematik, akıcı ve büyüleyici video kampanyaları. Sosyal medya, web siteniz ve dijital billboardlar için özel formatlar.",
          en: "Cinematic, fluid, and mesmerizing video campaigns for fashion brands. Custom formats tailored for social media, websites, and digital billboards."
        }
      },
      {
        id: "service-3",
        title: { tr: "AI Moda Kampanyaları", en: "AI Fashion Campaigns" },
        desc: {
          tr: "Sezon koleksiyonlarınız için hayal gücünüzün sınırlarını aşan konseptlerde, lüks dergi editöryali kalitesinde editoryal kampanya çekimleri.",
          en: "Editorial campaign shoots of luxury magazine quality, set in concepts that exceed the limits of imagination for your seasonal collections."
        }
      },
      {
        id: "service-4",
        title: { tr: "Sosyal Medya İçerikleri", en: "Social Media Content" },
        desc: {
          tr: "Instagram, TikTok ve YouTube Shorts için marka kimliğinizle mükemmel uyumlu, estetik açıdan kusursuz ve yüksek etkileşimli video & görsel serileri.",
          en: "Aesthetically perfect and highly engaging video & image series for Instagram, TikTok, and YouTube Shorts, in perfect harmony with your brand identity."
        }
      },
      {
        id: "service-5",
        title: { tr: "Dijital Katalog Üretimi", en: "Digital Catalog Production" },
        desc: {
          tr: "E-ticaret ve lookbook ihtiyaçlarınız için yapay zekâ modelleriyle hızlı, tutarlı ve premium standartlarda dijital katalog çekimleri.",
          en: "Fast, consistent, and premium-quality digital catalog and lookbook shoots featuring AI-generated models for e-commerce and marketing needs."
        }
      }
    ],
    whyUsHeader: {
      title: {
        tr: "Neden Sunai Studio",
        en: "Why Sunai Studio"
      },
      subtitle: {
        tr: "Fiziksel sınırları ortadan kaldıran yapay zeka teknolojimizle kreatif vizyonunuzu en üst düzeye taşıyoruz.",
        en: "We elevate your creative vision by removing physical boundaries using our cutting-edge AI technologies."
      },
      heading: {
        tr: "Estetik ve Teknolojinin Kusursuz Birleşimi",
        en: "The Perfect Blend of Aesthetics & Technology"
      }
    },
    whyUsReasons: [
      {
        id: "reason-1",
        title: { tr: "Sınırsız Lokasyon", en: "Infinite Locations" },
        desc: {
          tr: "Seyahat ve stüdyo bütçesi olmadan, koleksiyonlarınızı dünyanın en özel mekanlarında veya hayali mimari tasarımlarda fotoğraflayın.",
          en: "Showcase your collections in the world's most exclusive locations or imaginary architectural designs without travel or studio expenses."
        }
      },
      {
        id: "reason-2",
        title: { tr: "Premium Yapay Zeka Modelleri", en: "Premium AI Models" },
        desc: {
          tr: "Markanızın hedef kitlesine en uygun demografik özelliklerde, gerçekçi ve yüksek çözünürlüklü dijital modellerle lookbook hazırlayın.",
          en: "Prepare lookbooks featuring realistic, high-resolution digital models tailored to your brand's target demographics."
        }
      },
      {
        id: "reason-3",
        title: { tr: "Kusursuz Kumaş & Doku Kalitesi", en: "Impeccable Fabric & Texture" },
        desc: {
          tr: "Tasarımlarınızın renk, dikiş ve kumaş dokusu kalitesini 4K çözünürlükte, hiçbir bozulma olmadan detaylıca yansıtıyoruz.",
          en: "We represent your designs' colors, stitching, and fabrics in 4K resolution with complete texture accuracy and no distortion."
        }
      },
      {
        id: "reason-4",
        title: { tr: "Düşük Maliyet, Hızlı Teslimat", en: "Low Cost, Fast Delivery" },
        desc: {
          tr: "Geleneksel reklam prodüksiyonlarında haftalar süren ve milyonlara mal olan süreci günler içinde, bütçe dostu olarak tamamlıyoruz.",
          en: "We deliver in days what takes traditional advertising productions weeks and massive budgets to complete, at client-friendly pricing."
        }
      }
    ],
    beforeAfter: {
      title: {
        tr: "İnteraktif Dönüşüm",
        en: "Interactive Transformation"
      },
      subtitle: {
        tr: "Ham stüdyo çekimlerinin ve taslakların yapay zeka ile lüks dergi kapaklarına dönüşümünü inceleyin.",
        en: "See how raw studio captures and drafts convert into high-end editorial campaigns through AI."
      },
      original: {
        tr: "Orijinal Çekim",
        en: "Original Shoot"
      },
      enhanced: {
        tr: "AI Dokunuşu",
        en: "AI Enhanced"
      }
    },
    processHeader: {
      title: {
        tr: "Çalışma Süreci",
        en: "Our Process"
      },
      subtitle: {
        tr: "Hayalinizdeki kampanyayı hayata geçirirken izlediğimiz modern ve verimli 4 aşamalı süreç.",
        en: "The modern, highly efficient 4-step process we follow to bring your dream campaigns to life."
      },
      heading: {
        tr: "Fikirlerden Kampanyalara",
        en: "From Concepts to Campaigns"
      }
    },
    processSteps: [
      {
        id: "step-1",
        badge: { tr: "Adım 01 / Briefing", en: "Step 01 / Briefing" },
        title: { tr: "Kreatif Brief", en: "Creative Brief" },
        desc: {
          tr: "Ürünlerinizi, koleksiyonunuzun konseptini, hedef lokasyonları ve marka estetiğinizi detaylıca analiz ediyoruz.",
          en: "We deeply analyze your products, collection concepts, desired locations, and brand aesthetics."
        }
      },
      {
        id: "step-2",
        badge: { tr: "Adım 02 / Conceptualization", en: "Step 02 / Concept" },
        title: { tr: "Konsept Tasarımı", en: "Concept Design" },
        desc: {
          tr: "Yapay zeka modellerimizi markanıza özel eğitiyor; mekan, model ve ışık alternatifleri sunan moodboard'lar oluşturuyoruz.",
          en: "We train our AI models specifically on your brand; constructing moodboards with alternate locations, models, and light styles."
        }
      },
      {
        id: "step-3",
        badge: { tr: "Adım 03 / Production", en: "Step 03 / Production" },
        title: { tr: "AI Prodüksiyonu", en: "AI Production" },
        desc: {
          tr: "Seçilen konseptlerde yüksek çözünürlüklü 4K editoryal görseller ve akıcı video kampanyaları üretiyoruz.",
          en: "We generate high-resolution 4K editorial visuals and fluid video campaigns matching the approved concepts."
        }
      },
      {
        id: "step-4",
        badge: { tr: "Adım 04 / Delivery", en: "Step 04 / Delivery" },
        title: { tr: "Final & Teslimat", en: "Final & Delivery" },
        desc: {
          tr: "Görsel rötuşlar ve video kurgular tamamlanarak kampanyanızı dijital ve basılı mecralara hazır teslim ediyoruz.",
          en: "With final visual retouching and video edits complete, we deliver your campaign ready for digital and print channels."
        }
      }
    ],
    testimonialsHeader: {
      title: { tr: "Müşteri Deneyimleri", en: "Testimonials" },
      subtitle: { tr: "İş birliği yaptığımız lüks segment markaların görüşleri.", en: "What our luxury segment brand partners say about working with us." }
    },
    testimonials: [
      {
        id: "test-1",
        quote: {
          tr: "Sunai Studio ile gerçekleştirdiğimiz sezon çekiminde aldığımız sonuçlar büyüleyiciydi. Lokasyon maliyetlerimizi sıfırlayarak lüks segmentte bir iş ortaya koydular.",
          en: "The results we achieved for our seasonal shoot with Sunai Studio were mesmerizing. They delivered luxury-grade work while zeroing out our physical location costs."
        },
        author: "Melis Yılmaz",
        title: { tr: "Kreatif Direktör, Maison L'Aura", en: "Creative Director, Maison L'Aura" }
      },
      {
        id: "test-2",
        quote: {
          tr: "Yapay zeka modellerinin inandırıcılığı ve dokuların netliği bizi şaşırttı. Gelinlik koleksiyonumuzu en seçkin saray mekanlarında sergileme fırsatı bulduk.",
          en: "We were astonished by the realism of the AI models and texture details. We had the opportunity to showcase our bridal collection in the most exclusive palace settings."
        },
        author: "Ahmet Demir",
        title: { tr: "Kurucu, Demir Bridal", en: "Founder, Demir Bridal" }
      }
    ],
    faqsHeader: {
      title: { tr: "Sıkça Sorulan Sorular", en: "Frequently Asked Questions" },
      subtitle: { tr: "Sunai Studio AI görsel prodüksiyon süreçleri hakkında merak edilenler.", en: "Frequently asked questions about Sunai Studio AI visual production processes." }
    },
    faqs: [
      {
        id: "faq-1",
        q: { tr: "Ürünlerimizi size nasıl ulaştırıyoruz?", en: "How do we send our products to you?" },
        a: {
          tr: "Ürünlerinizi yüksek çözünürlüklü fotoğraflarını göndererek veya stüdyomuza kargolayarak ulaştırabilirsiniz. Yapay zeka ile profesyonel çekimleri biz gerçekleştiriyoruz.",
          en: "You can send high-resolution photos of your products or ship them to our studio. We carry out the professional shoots using AI."
        }
      },
      {
        id: "faq-2",
        q: { tr: "Teslimat süreleri ne kadardır?", en: "What are the delivery times?" },
        a: {
          tr: "Proje kapsamına göre değişmekle birlikte, geleneksel çekimlerde haftalar süren post-prodüksiyon süreçlerini 3 ila 7 iş günü içinde tamamlıyoruz.",
          en: "Varying by project scope, we complete post-production in 3 to 7 business days, bypassing the weeks-long timelines of traditional shoots."
        }
      },
      {
        id: "faq-3",
        q: { tr: "Çıktı çözünürlükleri dijital billboardlara uygun mu?", en: "Are output resolutions suitable for digital billboards?" },
        a: {
          tr: "Evet, tüm video ve görsel çıktılarimizi 4K ve ultra yüksek çözünürlüklü teslim ediyoruz. Büyük e-ticaret siteleri, sosyal medya ve billboardlar için mükemmel netliktedir.",
          en: "Yes, we deliver all video and image outputs in 4K and ultra-high resolutions. They have perfect clarity for major e-commerce platforms, social media, and billboards."
        }
      }
    ],
    contactHeader: {
      title: {
        tr: "Bize Ulaşın",
        en: "Contact Us"
      },
      subtitle: {
        tr: "Kreatif projeleriniz ve fiyatlandırma seçeneklerimiz hakkında bilgi almak için formu doldurun.",
        en: "Fill out the form to inquire about our creative projects and tailored pricing options."
      },
      heading: {
        tr: "Bir Proje mi Planlıyorsunuz?",
        en: "Planning a Project?"
      }
    }
  };
}
