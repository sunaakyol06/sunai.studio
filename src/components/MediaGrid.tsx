"use client";

import MediaCard from "./MediaCard";
import Reveal from "./Reveal";

interface MediaItem {
  id: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  ratio?: "9:16" | "1:1" | "4:5" | "3:4" | "16:9";
  title?: { tr: string; en: string };
}

interface MediaGridProps {
  media: MediaItem[];
}

export default function MediaGrid({ media }: MediaGridProps) {
  const videos = media.filter((item) => item.type === "video");
  const images = media.filter((item) => item.type === "image");

  if (media.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-line/50 rounded-xl2 bg-cream/30">
        <p className="font-sans text-stone text-base">
          Henüz içerik eklenmedi. / No content added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="space-y-8">
          <Reveal>
            <div className="flex items-center gap-4">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                Sinematik Prodüksiyon / Campaigns
              </h3>
              <div className="flex-1 h-[1px] bg-line/30" />
              <span className="font-mono text-[10px] tracking-widest text-stone uppercase">
                {videos.length} Video
              </span>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {videos.map((item, idx) => (
              <Reveal key={item.id} delay={0.1 * (idx % 3)}>
                <MediaCard media={item} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}
      {images.length > 0 && (
        <div className="space-y-8">
          <Reveal>
            <div className="flex items-center gap-4">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                Editoryal Çekimler / Visuals
              </h3>
              <div className="flex-1 h-[1px] bg-line/30" />
              <span className="font-mono text-[10px] tracking-widest text-stone uppercase">
                {images.length} Görsel
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {images.map((item, idx) => (
              <Reveal key={item.id} delay={0.1 * (idx % 3)}>
                <MediaCard media={item} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
