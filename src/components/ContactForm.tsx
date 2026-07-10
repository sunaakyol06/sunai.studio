"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", brand: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-cream/70 backdrop-blur-sm border border-line/45 rounded-xl2 p-8 md:p-10 shadow-sm">
      {status === "success" ? (
        <div className="flex flex-col items-center text-center py-10 animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-brass mb-6" />
          <h3 className="font-display text-2xl font-bold text-ink mb-2">
            Teşekkürler
          </h3>
          <p className="font-sans text-stone text-sm leading-relaxed max-w-md">
            {t("success")}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-mono text-[10px] tracking-widest uppercase text-stone mb-2">
              {t("name")}
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-bone/50 border border-line/50 rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder-stone-soft focus:outline-none focus:border-brass transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block font-mono text-[10px] tracking-widest uppercase text-stone mb-2">
              {t("brand")}
            </label>
            <input
              type="text"
              id="brand"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full bg-bone/50 border border-line/50 rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder-stone-soft focus:outline-none focus:border-brass transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-mono text-[10px] tracking-widest uppercase text-stone mb-2">
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-bone/50 border border-line/50 rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder-stone-soft focus:outline-none focus:border-brass transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-mono text-[10px] tracking-widest uppercase text-stone mb-2">
              {t("message")}
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-bone/50 border border-line/50 rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder-stone-soft focus:outline-none focus:border-brass transition-colors duration-300 resize-none"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-clay text-xs font-sans">
              <AlertCircle size={16} />
              <span>{t("error")}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-widest bg-clay text-bone hover:bg-clay-deep py-4 rounded-full font-bold transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed border border-clay hover:border-clay-deep cursor-pointer"
          >
            {status === "sending" ? (
              <span>{t("sending")}</span>
            ) : (
              <>
                <span>{t("submit")}</span>
                <Send size={12} className="w-3 h-3" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
