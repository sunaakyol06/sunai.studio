import uploadsData from "./uploads.json";

export type I18nText = { tr: string; en: string };
export type MediaType = "video" | "image";

export interface MediaItem {
  id: string;
  type: MediaType;
  src: string;
  poster?: string;
  ratio?: "9:16" | "1:1" | "4:5" | "3:4" | "16:9";
  title?: I18nText;
}

export interface Sector {
  slug: string;
  name: I18nText;
  tagline: I18nText;
  cover: string;
  accent: string;
  media: MediaItem[];
}

export const baseSectors: Sector[] = [
  {
    slug: "gelinlik-abiye",
    name: { tr: "Gelinlik & Abiye", en: "Bridal & Evening Wear" },
    tagline: {
      tr: "Kusursuz dantel detayları ve büyüleyici gelinlik kampanyaları.",
      en: "Flawless lace details and breathtaking bridal campaigns."
    },
    cover: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1000&auto=format&fit=crop",
    accent: "#800f1b",
    media: [
      {
        id: "gelinlik-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1000&auto=format&fit=crop",
        ratio: "3:4",
        title: { tr: "Ethereal Düşler Koleksiyonu", en: "Ethereal Dreams Collection" }
      },
      {
        id: "gelinlik-2",
        type: "image",
        src: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=1000&auto=format&fit=crop",
        ratio: "4:5",
        title: { tr: "Saray İhtişamı - Detay", en: "Palace Splendor - Detail" }
      }
    ]
  },
  {
    slug: "moda-tekstil",
    name: { tr: "Moda & Tekstil", en: "Fashion & Textile" },
    tagline: {
      tr: "Paris ve Milano sokaklarında canlanan yüksek moda koleksiyonları.",
      en: "High fashion collections coming alive on the streets of Paris and Milan."
    },
    cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    accent: "#c5a059",
    media: [
      {
        id: "moda-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
        ratio: "16:9",
        title: { tr: "Sessiz Lüks - Sonbahar/Kış", en: "Quiet Luxury - Autumn/Winter" }
      },
      {
        id: "moda-2",
        type: "image",
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
        ratio: "3:4",
        title: { tr: "Akdeniz Rüzgarı - Yaz", en: "Mediterranean Breeze - Summer" }
      }
    ]
  },
  {
    slug: "taki-kozmetik",
    name: { tr: "Takı & Kozmetik", en: "Jewelry & Cosmetics" },
    tagline: {
      tr: "Işıltı ve pürüzsüz dokuların makro çekimlerdeki kusursuz dansı.",
      en: "The perfect dance of shimmer and smooth textures in macro photography."
    },
    cover: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop",
    accent: "#330c11",
    media: [
      {
        id: "taki-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop",
        ratio: "1:1",
        title: { tr: "Saf Kozmetik - Minimal Çizgiler", en: "Pure Cosmetics - Minimal Lines" }
      },
      {
        id: "taki-2",
        type: "image",
        src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
        ratio: "4:5",
        title: { tr: "Altın Parıltısı - Yüksek Mücevher", en: "Golden Radiance - High Jewelry" }
      }
    ]
  },
  {
    slug: "ayakkabi-canta",
    name: { tr: "Ayakkabı & Çanta", en: "Shoes & Bags" },
    tagline: {
      tr: "Deri işçiliğinin ve modern tasarımın premium sunumları.",
      en: "Premium presentations of leather craftsmanship and modern design."
    },
    cover: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
    accent: "#8a7056",
    media: [
      {
        id: "ayakkabi-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
        ratio: "3:4",
        title: { tr: "Zarif Adımlar - Deri Koleksiyonu", en: "Elegant Steps - Leather Collection" }
      },
      {
        id: "ayakkabi-2",
        type: "image",
        src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
        ratio: "1:1",
        title: { tr: "Premium Çanta Tasarımları", en: "Premium Bag Designs" }
      }
    ]
  }
];

const typedUploads = uploadsData as Record<string, Omit<MediaItem, "id">[]>;

export const sectors: Sector[] = baseSectors.map((sector) => {
  const uploadedMedia = typedUploads[sector.slug] || [];
  const mergedMedia = [...sector.media];
  
  uploadedMedia.forEach((item, index) => {
    if (!mergedMedia.some((m) => m.src === item.src)) {
      mergedMedia.push({
        id: `upload-${sector.slug}-${index}`,
        type: item.type,
        src: item.src,
        poster: item.poster,
        ratio: item.ratio,
        title: item.title,
      });
    }
  });

  return {
    ...sector,
    media: mergedMedia,
  };
});

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}

export function sectorSlugs(): string[] {
  return sectors.map((s) => s.slug);
}
