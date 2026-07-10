import type { Metadata } from "next";
import { Fraunces, Archivo, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getMergedSettings } from "@/lib/content";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | sunai.studio",
    default: "sunai.studio | AI-Powered Fashion & Visual Production",
  },
  description: "AI-powered fashion and visual production studio for fashion brands.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await getMergedSettings(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-ink grain">
        <NextIntlClientProvider messages={messages}>
          <Navbar settings={settings} />
          <main className="flex-grow flex flex-col pt-[73px] md:pt-[82px]">{children}</main>
          <Footer settings={settings} />
          <WhatsAppButton settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
