"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { MergedSettings } from "@/lib/content";

interface WhatsAppButtonProps {
  settings: MergedSettings;
}

export default function WhatsAppButton({ settings }: WhatsAppButtonProps) {
  const t = useTranslations("Contact");
  
  const whatsappNum = settings.whatsapp || "+905300000000";
  const encodedMsg = encodeURIComponent("Merhaba, Sunai Studio ile bir proje başlatmak istiyoruz.");
  const waUrl = `https://wa.me/${whatsappNum.replace(/[^\d+]/g, "")}?text=${encodedMsg}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center bg-brass text-ink hover:bg-brass/90 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group hover:-translate-y-1 border border-line/30"
      aria-label="WhatsApp Contact"
    >
      <MessageCircle size={20} className="w-5 h-5" />
      <span className="font-sans text-xs uppercase tracking-widest font-bold max-w-0 overflow-hidden group-hover:max-w-[200px] group-hover:ml-2 transition-all duration-500 ease-in-out whitespace-nowrap">
        {t("whatsappCta")}
      </span>
    </a>
  );
}
