import { sectors, Sector, MediaItem, I18nText } from "../data/sectors";
import { getStore, applyOrderAndHidden } from "./overrides";
import { SiteSettings, getDefaultSettings } from "./types";

export interface MergedSettings {
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
    title: string;
    subtitle: string;
    cta: string;
    badge: string;
    mediaType: "video" | "image";
    mediaSrc: string;
    mediaPoster?: string;
  };
  showcaseHeader: {
    title: string;
    subtitle: string;
  };
  servicesHeader: {
    title: string;
    subtitle: string;
  };
  services: {
    id: string;
    title: string;
    desc: string;
  }[];
  whyUsHeader: {
    title: string;
    subtitle: string;
    heading: string;
  };
  whyUsReasons: {
    id: string;
    title: string;
    desc: string;
  }[];
  beforeAfter: {
    title: string;
    subtitle: string;
    original: string;
    enhanced: string;
  };
  processHeader: {
    title: string;
    subtitle: string;
    heading: string;
  };
  processSteps: {
    id: string;
    badge: string;
    title: string;
    desc: string;
  }[];
  testimonialsHeader: {
    title: string;
    subtitle: string;
  };
  testimonials: {
    id: string;
    quote: string;
    author: string;
    title: string;
  }[];
  faqsHeader: {
    title: string;
    subtitle: string;
  };
  faqs: {
    id: string;
    q: string;
    a: string;
  }[];
  contactHeader: {
    title: string;
    subtitle: string;
    heading: string;
  };
}

export async function getMergedSettings(locale: string): Promise<MergedSettings> {
  const store = await getStore();
  const settings = store.settings || getDefaultSettings();
  const l = (locale === "en" ? "en" : "tr") as "tr" | "en";

  return {
    logo: settings.logo,
    whatsapp: settings.whatsapp,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    socials: settings.socials,
    hero: {
      title: settings.hero.title[l] || settings.hero.title.tr,
      subtitle: settings.hero.subtitle[l] || settings.hero.subtitle.tr,
      cta: settings.hero.cta[l] || settings.hero.cta.tr,
      badge: settings.hero.badge[l] || settings.hero.badge.tr,
      mediaType: settings.hero.mediaType,
      mediaSrc: settings.hero.mediaSrc,
      mediaPoster: settings.hero.mediaPoster
    },
    showcaseHeader: {
      title: settings.showcaseHeader?.title?.[l] || settings.showcaseHeader?.title?.tr || "Showcase",
      subtitle: settings.showcaseHeader?.subtitle?.[l] || settings.showcaseHeader?.subtitle?.tr || ""
    },
    servicesHeader: {
      title: settings.servicesHeader.title[l] || settings.servicesHeader.title.tr,
      subtitle: settings.servicesHeader.subtitle[l] || settings.servicesHeader.subtitle.tr
    },
    services: (settings.services || []).map((s) => ({
      id: s.id,
      title: s.title[l] || s.title.tr,
      desc: s.desc[l] || s.desc.tr
    })),
    whyUsHeader: {
      title: settings.whyUsHeader?.title?.[l] || settings.whyUsHeader?.title?.tr || "Why Us",
      subtitle: settings.whyUsHeader?.subtitle?.[l] || settings.whyUsHeader?.subtitle?.tr || "",
      heading: settings.whyUsHeader?.heading?.[l] || settings.whyUsHeader?.heading?.tr || ""
    },
    whyUsReasons: (settings.whyUsReasons || []).map((r) => ({
      id: r.id,
      title: r.title[l] || r.title.tr,
      desc: r.desc[l] || r.desc.tr
    })),
    beforeAfter: {
      title: settings.beforeAfter?.title?.[l] || settings.beforeAfter?.title?.tr || "",
      subtitle: settings.beforeAfter?.subtitle?.[l] || settings.beforeAfter?.subtitle?.tr || "",
      original: settings.beforeAfter?.original?.[l] || settings.beforeAfter?.original?.tr || "",
      enhanced: settings.beforeAfter?.enhanced?.[l] || settings.beforeAfter?.enhanced?.tr || ""
    },
    processHeader: {
      title: settings.processHeader?.title?.[l] || settings.processHeader?.title?.tr || "",
      subtitle: settings.processHeader?.subtitle?.[l] || settings.processHeader?.subtitle?.tr || "",
      heading: settings.processHeader?.heading?.[l] || settings.processHeader?.heading?.tr || ""
    },
    processSteps: (settings.processSteps || []).map((p) => ({
      id: p.id,
      badge: p.badge[l] || p.badge.tr,
      title: p.title[l] || p.title.tr,
      desc: p.desc[l] || p.desc.tr
    })),
    testimonialsHeader: {
      title: settings.testimonialsHeader.title[l] || settings.testimonialsHeader.title.tr,
      subtitle: settings.testimonialsHeader.subtitle[l] || settings.testimonialsHeader.subtitle.tr
    },
    testimonials: (settings.testimonials || []).map((t) => ({
      id: t.id,
      quote: t.quote[l] || t.quote.tr,
      author: t.author,
      title: t.title[l] || t.title.tr
    })),
    faqsHeader: {
      title: settings.faqsHeader.title[l] || settings.faqsHeader.title.tr,
      subtitle: settings.faqsHeader.subtitle[l] || settings.faqsHeader.subtitle.tr
    },
    faqs: (settings.faqs || []).map((f) => ({
      id: f.id,
      q: f.q[l] || f.q.tr,
      a: f.a[l] || f.a.tr
    })),
    contactHeader: {
      title: settings.contactHeader?.title?.[l] || settings.contactHeader?.title?.tr || "",
      subtitle: settings.contactHeader?.subtitle?.[l] || settings.contactHeader?.subtitle?.tr || "",
      heading: settings.contactHeader?.heading?.[l] || settings.contactHeader?.heading?.tr || ""
    }
  };
}

export async function getDisplaySectors(): Promise<Sector[]> {
  const store = await getStore();
  
  const baseList = [...sectors];
  
  const customList: Sector[] = store.custom.map((cs) => ({
    slug: cs.slug,
    name: { tr: cs.name, en: cs.name },
    tagline: { tr: cs.tagline, en: cs.tagline },
    cover: cs.cover,
    accent: cs.accent,
    media: []
  }));
  
  const combinedSectors = [...baseList, ...customList];

  return combinedSectors.map((sector) => {
    const override = store.overrides[sector.slug];
    if (!override) return sector;

    let mediaList = [...sector.media];
    
    if (override.added && override.added.length > 0) {
      override.added.forEach((m) => {
        if (!mediaList.some((item) => item.id === m.id || item.src === m.src)) {
          mediaList.push({
            id: m.id,
            type: m.type,
            src: m.src,
            poster: m.poster,
            ratio: m.ratio,
            title: { tr: m.title, en: m.title }
          });
        }
      });
    }

    if (override.titles) {
      mediaList = mediaList.map((m) => {
        const customTitle = override.titles?.[m.id];
        if (customTitle !== undefined) {
          return {
            ...m,
            title: { tr: customTitle, en: customTitle }
          };
        }
        return m;
      });
    }

    const finalizedMedia = applyOrderAndHidden(mediaList, override);

    return {
      ...sector,
      media: finalizedMedia
    };
  });
}

export async function getDisplaySector(slug: string): Promise<Sector | undefined> {
  const displaySectors = await getDisplaySectors();
  return displaySectors.find((s) => s.slug === slug);
}
