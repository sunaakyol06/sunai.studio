"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { imageUrl } from "@/lib/media";
import { ArrowRight } from "lucide-react";

interface Sector {
  slug: string;
  name: { tr: string; en: string };
  tagline: { tr: string; en: string };
  cover: string;
  accent: string;
  media: any[];
  coverImage?: string;
}

interface SectorCardProps {
  sector: Sector;
}

export default function SectorCard({ sector }: SectorCardProps) {
  const locale = useLocale() as "tr" | "en";
  const name = sector.name[locale];
  const tagline = sector.tagline[locale];

  const coverUrl =
    sector.coverImage ||
    sector.media.find((m: any) => m.type === "image")?.src ||
    sector.media[0]?.src ||
    sector.cover;

  return (
    <Link
      href={`/calismalar/${sector.slug}`}
      className="group block relative overflow-hidden rounded-xl2 bg-cream border border-line/30 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 aspect-[4/5]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl(coverUrl, 1000)}
          alt={name}
          fill
          sizes="(max-w-7xl) 33vw, (max-w-md) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: sector.accent || "var(--color-brass)" }}
            />
            <span className="font-mono text-[9px] tracking-widest uppercase text-brass font-bold">
              Koleksiyon / Collection
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-bone group-hover:text-brass transition-colors duration-300">
            {name}
          </h3>

          <p className="font-sans text-xs text-stone-soft/90 line-clamp-2 leading-relaxed">
            {tagline}
          </p>

          <div className="pt-2 flex items-center gap-2 font-mono text-[10px] tracking-widest text-bone uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Keşfet / Explore</span>
            <ArrowRight size={12} className="text-brass" />
          </div>
        </div>
      </div>
    </Link>
  );
}
