"use client";

import Image from "next/image";
import { imageUrl } from "@/lib/media";
import VideoPlayer from "./VideoPlayer";
import { useLocale } from "next-intl";

interface MediaCardProps {
  media: {
    id: string;
    type: "video" | "image";
    src: string;
    poster?: string;
    ratio?: "9:16" | "1:1" | "4:5" | "3:4" | "16:9";
    title?: { tr: string; en: string };
  };
}

export default function MediaCard({ media }: MediaCardProps) {
  const locale = useLocale() as "tr" | "en";
  const title = media.title ? media.title[locale] : "";

  const ratioClass = {
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
    "4:5": "aspect-[4/5]",
    "3:4": "aspect-[3/4]",
    "16:9": "aspect-[16/9]"
  }[media.ratio || "3:4"];

  return (
    <div className={`relative overflow-hidden rounded-xl2 bg-cream group border border-line/30 shadow-sm transition-all duration-500 hover:-translate-y-1 ${ratioClass}`}>
      {media.type === "video" ? (
        <VideoPlayer
          src={media.src}
          poster={media.poster}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl(media.src, 1000)}
            alt={title || "Sunai Studio Campaign"}
            fill
            sizes="(max-w-7xl) 33vw, (max-w-md) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={media.id.startsWith("cover")}
          />
        </div>
      )}

      {title && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out pointer-events-none">
          <h4 className="font-display text-lg font-medium text-bone">
            {title}
          </h4>
          <p className="font-mono text-[9px] uppercase tracking-widest text-brass mt-1">
            {media.type === "video" ? "Video / Film" : "Visual / Fotoğraf"}
          </p>
        </div>
      )}
    </div>
  );
}
