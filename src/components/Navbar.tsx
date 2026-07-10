"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import { Menu, X } from "lucide-react";
import { MergedSettings } from "@/lib/content";

interface NavbarProps {
  settings: MergedSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/calismalar", label: t("work") },
    { href: "/hizmetler", label: t("services") },
    { href: "/iletisim", label: t("contact") },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const logoText = settings.logo || "sunai.studio";
  const ctaText = settings.hero.cta || t("cta");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bone/90 backdrop-blur-md py-4 border-b border-line/40 shadow-sm"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-ink hover:text-clay transition-colors duration-300"
        >
          {logoText}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1 hover:text-clay duration-300 ${
                  isActive ? "text-clay font-semibold" : "text-ink-soft"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/iletisim"
            className="font-sans text-xs uppercase tracking-widest bg-clay text-bone hover:bg-clay-deep px-5 py-2.5 rounded-full font-medium transition-all duration-300 active:scale-[0.97] hover:shadow-md border border-clay hover:border-clay-deep"
          >
            {ctaText}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <LocaleSwitcher />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-ink hover:text-clay transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-bone z-40 flex flex-col px-6 py-8 border-t border-line/40 animate-fade-in">
          <nav className="flex flex-col gap-6 mb-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`font-display text-2xl tracking-wide transition-colors ${
                    isActive ? "text-clay font-bold" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto">
            <Link
              href="/iletisim"
              onClick={handleLinkClick}
              className="block text-center font-sans text-sm uppercase tracking-widest bg-clay text-bone hover:bg-clay-deep py-4 rounded-full font-medium transition-all duration-300"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
