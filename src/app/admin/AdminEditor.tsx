"use client";

import { useState, useTransition } from "react";
import { Store, AddedMedia, CustomSector, SectorOverride, SiteSettings, getDefaultSettings } from "@/lib/types";
import { baseSectors, Sector, MediaItem } from "@/data/sectors";
import { persistStore, logout } from "./actions";
import { 
  Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Upload, LogOut, Save, 
  Image as ImageIcon, Video, Settings, Folder, Mail, Phone, MapPin, 
  MessageCircle, HelpCircle, Star, Sparkles, Sliders, Zap
} from "lucide-react";

interface AdminEditorProps {
  initialStore: Store;
}

type SettingsTab = 
  | "general" 
  | "hero" 
  | "showcase" 
  | "services" 
  | "whyus" 
  | "beforeafter" 
  | "process" 
  | "testimonials" 
  | "faqs" 
  | "contact";

export default function AdminEditor({ initialStore }: AdminEditorProps) {
  const [store, setStore] = useState<Store>(initialStore);
  const [activeSectorSlug, setActiveSectorSlug] = useState<string>("__settings__"); // default to site settings
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("general");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState(false);

  // New Sector form state
  const [newSector, setNewSector] = useState({
    name: "",
    tagline: "",
    accent: "#800f1b",
    coverUrl: ""
  });
  const [sectorCoverFile, setSectorCoverFile] = useState<File | null>(null);

  // New item draft states
  const [newFaq, setNewFaq] = useState({ qTr: "", qEn: "", aTr: "", aEn: "" });
  const [newService, setNewService] = useState({ titleTr: "", titleEn: "", descTr: "", descEn: "" });
  const [newTestimonial, setNewTestimonial] = useState({ quoteTr: "", quoteEn: "", author: "", titleTr: "", titleEn: "" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const sectorsList = [
    ...baseSectors,
    ...store.custom.map((cs) => ({
      slug: cs.slug,
      name: { tr: cs.name, en: cs.name },
      tagline: { tr: cs.tagline, en: cs.tagline },
      cover: cs.cover,
      accent: cs.accent,
      media: [] as MediaItem[]
    }))
  ];

  const activeSector = sectorsList.find((s) => s.slug === activeSectorSlug);
  const activeOverride = store.overrides[activeSectorSlug] || { order: [], hidden: [], titles: {}, added: [] };

  const activeBaseMedia = activeSector?.media || [];
  const activeAddedMedia = activeOverride.added || [];
  
  const totalMedia: (MediaItem & { isAdded?: boolean })[] = [
    ...activeBaseMedia.map(m => ({ ...m, isAdded: false })),
    ...activeAddedMedia.map(m => ({
      id: m.id,
      type: m.type,
      src: m.src,
      poster: m.poster,
      ratio: m.ratio,
      title: { tr: m.title, en: m.title },
      isAdded: true
    }))
  ];

  const mediaWithOverrideTitles = totalMedia.map(item => {
    const overrideTitle = activeOverride.titles?.[item.id];
    if (overrideTitle !== undefined) {
      return {
        ...item,
        title: { tr: overrideTitle, en: overrideTitle }
      };
    }
    return item;
  });

  const videosList = mediaWithOverrideTitles.filter(m => m.type === "video");
  const imagesList = mediaWithOverrideTitles.filter(m => m.type === "image");

  const sortMedia = (list: typeof mediaWithOverrideTitles) => {
    const order = activeOverride.order;
    if (!order || order.length === 0) return list;
    return [...list].sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  };

  const sortedVideos = sortMedia(videosList);
  const sortedImages = sortMedia(imagesList);

  const updateOverride = (slug: string, updatedFields: Partial<SectorOverride>) => {
    setStore((prev) => {
      const prevOverride = prev.overrides[slug] || { order: [], hidden: [], titles: {}, added: [] };
      return {
        ...prev,
        overrides: {
          ...prev.overrides,
          [slug]: {
            ...prevOverride,
            ...updatedFields
          }
        }
      };
    });
  };

  const handleTitleChange = (mediaId: string, value: string) => {
    const titles = { ...(activeOverride.titles || {}) };
    titles[mediaId] = value;
    updateOverride(activeSectorSlug, { titles });
  };

  const toggleVisibility = (mediaId: string) => {
    const hidden = [...(activeOverride.hidden || [])];
    if (hidden.includes(mediaId)) {
      updateOverride(activeSectorSlug, { hidden: hidden.filter(id => id !== mediaId) });
    } else {
      updateOverride(activeSectorSlug, { hidden: [...hidden, mediaId] });
    }
  };

  const deleteMedia = (mediaId: string) => {
    const added = (activeOverride.added || []).filter(m => m.id !== mediaId);
    const order = (activeOverride.order || []).filter(id => id !== mediaId);
    const hidden = (activeOverride.hidden || []).filter(id => id !== mediaId);
    
    const titles = { ...(activeOverride.titles || {}) };
    delete titles[mediaId];

    updateOverride(activeSectorSlug, { added, order, hidden, titles });
  };

  const moveMedia = (list: typeof totalMedia, index: number, direction: "up" | "down") => {
    const itemIds = list.map(m => m.id);
    if (index === 0 && direction === "up") return;
    if (index === list.length - 1 && direction === "down") return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedIds = [...itemIds];
    const temp = updatedIds[index];
    updatedIds[index] = updatedIds[newIndex];
    updatedIds[newIndex] = temp;

    updateOverride(activeSectorSlug, { order: updatedIds });
  };

  const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
    const publicId = `sunai/${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, "")}`;
    
    const signRes = await fetch("/api/admin/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId })
    });

    if (!signRes.ok) {
      throw new Error("Cloudinary imza üretilemedi / Signature generation failed");
    }

    const { signature, apiKey, timestamp, cloudName } = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("public_id", publicId);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData
    });

    if (!cloudRes.ok) {
      const err = await cloudRes.json();
      throw new Error(err.error?.message || "Cloudinary yükleme hatası / Cloudinary upload failed");
    }

    const data = await cloudRes.json();
    return data.secure_url;
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "image") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i], activeSectorSlug);
        uploadedUrls.push(url);
      }

      const newItems: AddedMedia[] = uploadedUrls.map((url, index) => {
        const id = `user-${Date.now()}-${index}`;
        return {
          id,
          type,
          src: url,
          title: files[index].name.split(".")[0],
          ratio: type === "image" ? "3:4" : "16:9"
        };
      });

      const currentAdded = activeOverride.added || [];
      const currentOrder = activeOverride.order.length > 0 
        ? activeOverride.order 
        : totalMedia.map(m => m.id);

      updateOverride(activeSectorSlug, {
        added: [...currentAdded, ...newItems],
        order: [...currentOrder, ...newItems.map(m => m.id)]
      });

      showToast(`${files.length} dosya başarıyla yüklendi.`, "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Dosya yüklenirken hata oluştu.", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCreateSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSector.name || !newSector.tagline) {
      showToast("Lütfen tüm alanları doldurun.", "error");
      return;
    }

    setUploading(true);
    try {
      let finalCover = newSector.coverUrl || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000";
      
      if (sectorCoverFile) {
        finalCover = await uploadToCloudinary(sectorCoverFile, "covers");
      }

      const slug = newSector.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (sectorsList.some((s) => s.slug === slug)) {
        showToast("Bu sektör ismi zaten mevcut.", "error");
        setUploading(false);
        return;
      }

      const customSect: CustomSector = {
        slug,
        name: newSector.name,
        tagline: newSector.tagline,
        cover: finalCover,
        accent: newSector.accent
      };

      setStore((prev) => ({
        ...prev,
        custom: [...prev.custom, customSect]
      }));

      setNewSector({ name: "", tagline: "", accent: "#800f1b", coverUrl: "" });
      setSectorCoverFile(null);
      setActiveSectorSlug(slug);
      showToast("Yeni sektör başarıyla oluşturuldu.", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Sektör oluşturulurken hata oluştu.", "error");
    } finally {
      setUploading(false);
    }
  };

  // --- Dynamic settings handlers ---
  const settings = store.settings || getDefaultSettings();

  const updateSettings = (updatedFields: Partial<SiteSettings>) => {
    setStore((prev) => {
      const prevSettings = prev.settings || getDefaultSettings();
      return {
        ...prev,
        settings: {
          ...prevSettings,
          ...updatedFields
        }
      };
    });
  };

  const handleHeroMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "hero");
      const detectedType = file.type.startsWith("video/") ? "video" : "image";
      updateSettings({
        hero: {
          ...settings.hero,
          mediaType: detectedType,
          mediaSrc: url,
          mediaUrl: url
        }
      });
      showToast("Hero medyası başarıyla güncellendi.", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Hero medyası yüklenirken hata oluştu.", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Faqs
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.qTr || !newFaq.aTr) {
      showToast("Soru ve Cevap alanları zorunludur.", "error");
      return;
    }
    const newItem = {
      id: `faq-${Date.now()}`,
      q: { tr: newFaq.qTr, en: newFaq.qEn || newFaq.qTr },
      a: { tr: newFaq.aTr, en: newFaq.aEn || newFaq.aTr }
    };
    updateSettings({ faqs: [...(settings.faqs || []), newItem] });
    setNewFaq({ qTr: "", qEn: "", aTr: "", aEn: "" });
    showToast("Yeni soru eklendi.", "success");
  };

  const handleDeleteFaq = (id: string) => {
    updateSettings({ faqs: (settings.faqs || []).filter(f => f.id !== id) });
    showToast("Soru silindi.", "success");
  };

  // Services
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.titleTr || !newService.descTr) {
      showToast("Başlık ve Açıklama zorunludur.", "error");
      return;
    }
    const newItem = {
      id: `service-${Date.now()}`,
      title: { tr: newService.titleTr, en: newService.titleEn || newService.titleTr },
      desc: { tr: newService.descTr, en: newService.descEn || newService.descTr }
    };
    updateSettings({ services: [...(settings.services || []), newItem] });
    setNewService({ titleTr: "", titleEn: "", descTr: "", descEn: "" });
    showToast("Yeni hizmet eklendi.", "success");
  };

  const handleDeleteService = (id: string) => {
    updateSettings({ services: (settings.services || []).filter(s => s.id !== id) });
    showToast("Hizmet silindi.", "success");
  };

  // Testimonials
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.quoteTr || !newTestimonial.author) {
      showToast("Yorum ve Yazar ismi zorunludur.", "error");
      return;
    }
    const newItem = {
      id: `test-${Date.now()}`,
      quote: { tr: newTestimonial.quoteTr, en: newTestimonial.quoteEn || newTestimonial.quoteTr },
      author: newTestimonial.author,
      title: { tr: newTestimonial.titleTr, en: newTestimonial.titleEn || newTestimonial.titleTr }
    };
    updateSettings({ testimonials: [...(settings.testimonials || []), newItem] });
    setNewTestimonial({ quoteTr: "", quoteEn: "", author: "", titleTr: "", titleEn: "" });
    showToast("Yeni müşteri yorumu eklendi.", "success");
  };

  const handleDeleteTestimonial = (id: string) => {
    updateSettings({ testimonials: (settings.testimonials || []).filter(t => t.id !== id) });
    showToast("Yorum silindi.", "success");
  };

  const handleSaveAll = () => {
    startTransition(async () => {
      const res = await persistStore(store);
      if (res && res.success) {
        showToast("Tüm değişiklikler kaydedildi ve site güncellendi.", "success");
      } else {
        showToast(res?.error || "Kaydetme sırasında bir hata oluştu.", "error");
      }
    });
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen font-sans bg-bone">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border text-sm animate-fade-in ${
            toast.type === "success"
              ? "bg-bone border-brass text-ink"
              : "bg-bone border-clay text-clay"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Top Header */}
      <header className="bg-ink text-bone border-b border-line/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-2xl font-bold text-bone">sunai.studio</h1>
          <span className="font-mono text-[9px] bg-brass text-ink px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Yönetim Paneli
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveAll}
            disabled={isPending || uploading}
            className="flex items-center gap-2 bg-brass hover:bg-brass/90 text-ink text-xs uppercase tracking-widest px-5 py-2.5 rounded-full font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Save size={14} className="w-3.5 h-3.5" />
            <span>Kaydet / Save</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-line/20 hover:border-line/40 text-stone-soft hover:text-bone text-xs uppercase tracking-widest px-4 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <LogOut size={14} className="w-3.5 h-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-grow flex grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-65px)]">
        {/* Sidebar - Settings & Sectors */}
        <aside className="lg:col-span-3 border-r border-line/30 p-6 bg-cream/20 space-y-6 overflow-y-auto max-h-full">
          {/* Main settings button */}
          <button
            onClick={() => setActiveSectorSlug("__settings__")}
            className={`w-full text-left text-sm px-4 py-3.5 rounded-lg transition-colors flex items-center gap-3 cursor-pointer ${
              activeSectorSlug === "__settings__"
                ? "bg-brass text-ink font-bold"
                : "hover:bg-line/20 text-ink-soft border border-line/30"
            }`}
          >
            <Settings size={16} />
            <span>Genel Site Ayarları</span>
          </button>

          <h2 className="font-mono text-[10px] tracking-widest uppercase text-stone font-bold border-b border-line/30 pb-2">
            Koleksiyonlar / Sectors
          </h2>
          <div className="space-y-1">
            {sectorsList.map((sector) => (
              <button
                key={sector.slug}
                onClick={() => setActiveSectorSlug(sector.slug)}
                className={`w-full text-left text-sm px-4 py-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                  activeSectorSlug === sector.slug
                    ? "bg-clay text-bone font-bold"
                    : "hover:bg-line/20 text-ink-soft"
                }`}
              >
                <span>{sector.name.tr}</span>
                <span className="text-[10px] font-mono opacity-60">
                  ({(store.overrides[sector.slug]?.added?.length || 0) + (baseSectors.find(s => s.slug === sector.slug)?.media?.length || 0)})
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-line/30 pt-6 space-y-4">
            <h3 className="font-mono text-[10px] tracking-widest uppercase text-stone font-bold">
              Yeni Sektör Ekle
            </h3>
            <form onSubmit={handleCreateSector} className="space-y-3">
              <div>
                <label className="block text-[9px] font-mono uppercase text-stone mb-1">Adı</label>
                <input
                  type="text"
                  required
                  placeholder="örn: Çocuk Giyimi"
                  value={newSector.name}
                  onChange={(e) => setNewSector({ ...newSector, name: e.target.value })}
                  className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none focus:border-brass"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-stone mb-1">Açıklama</label>
                <input
                  type="text"
                  required
                  placeholder="örn: Sevimli bebek katalog çekimleri"
                  value={newSector.tagline}
                  onChange={(e) => setNewSector({ ...newSector, tagline: e.target.value })}
                  className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none focus:border-brass"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-stone mb-1">Kapak Görseli</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSectorCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-[10px] text-stone file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-line file:text-ink cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-stone mb-1">Renk</label>
                <input
                  type="color"
                  value={newSector.accent}
                  onChange={(e) => setNewSector({ ...newSector, accent: e.target.value })}
                  className="w-full h-8 bg-bone border border-line/50 rounded cursor-pointer p-0.5"
                />
              </div>
              <button
                type="submit"
                disabled={uploading || isPending}
                className="w-full flex items-center justify-center gap-2 bg-ink text-bone hover:bg-ink-soft py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                <Plus size={12} className="w-3 h-3" />
                <span>Oluştur</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Workspace panel */}
        <main className="lg:col-span-9 p-8 bg-bone space-y-8 overflow-y-auto max-h-full">
          
          {/* GENERAL SETTINGS EDITOR */}
          {activeSectorSlug === "__settings__" ? (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-line/30 pb-6">
                <h2 className="font-display text-3xl font-bold text-ink">Genel Site Ayarları</h2>
                <p className="text-stone text-xs mt-1">Sitenin her alanını kod yazmadan buradan yönetebilirsiniz.</p>
              </div>

              {/* Settings Sub-Tabs */}
              <div className="flex flex-wrap border-b border-line/30 gap-4 md:gap-6 pb-1">
                {[
                  { id: "general", label: "Genel & İletişim", icon: <Mail size={14} /> },
                  { id: "hero", label: "Hero (Giriş)", icon: <Sliders size={14} /> },
                  { id: "showcase", label: "Portföy Başlık", icon: <Folder size={14} /> },
                  { id: "services", label: "Hizmetler", icon: <Sparkles size={14} /> },
                  { id: "whyus", label: "Neden Biz", icon: <HelpCircle size={14} /> },
                  { id: "beforeafter", label: "Önce/Sonra", icon: <Sliders size={14} /> },
                  { id: "process", label: "Süreç", icon: <Zap size={14} /> },
                  { id: "testimonials", label: "Yorumlar", icon: <Star size={14} /> },
                  { id: "faqs", label: "SSS (Sorular)", icon: <HelpCircle size={14} /> },
                  { id: "contact", label: "İletişim Metinleri", icon: <Mail size={14} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id as SettingsTab)}
                    className={`pb-3 text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
                      settingsTab === tab.id
                        ? "border-clay text-clay"
                        : "border-transparent text-stone hover:text-ink"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* TAB CONTENT: GENERAL & CONTACT */}
              {settingsTab === "general" && (
                <div className="space-y-6 max-w-2xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone mb-2">Logo Metni</label>
                      <input
                        type="text"
                        value={settings.logo}
                        onChange={(e) => updateSettings({ logo: e.target.value })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs focus:outline-none focus:border-brass text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone mb-2">WhatsApp Numarası</label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs focus:outline-none focus:border-brass text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone mb-2">Telefon</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => updateSettings({ phone: e.target.value })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs focus:outline-none focus:border-brass text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone mb-2">E-posta</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSettings({ email: e.target.value })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs focus:outline-none focus:border-brass text-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-stone mb-2">Ofis Adresi</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => updateSettings({ address: e.target.value })}
                      className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs focus:outline-none focus:border-brass text-ink"
                    />
                  </div>

                  <div className="border-t border-line/30 pt-4 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Sosyal Medya Linkleri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Instagram</label>
                        <input
                          type="text"
                          value={settings.socials?.instagram}
                          onChange={(e) => updateSettings({ socials: { ...settings.socials, instagram: e.target.value } })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Vimeo</label>
                        <input
                          type="text"
                          value={settings.socials?.vimeo}
                          onChange={(e) => updateSettings({ socials: { ...settings.socials, vimeo: e.target.value } })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">YouTube</label>
                        <input
                          type="text"
                          value={settings.socials?.youtube}
                          onChange={(e) => updateSettings({ socials: { ...settings.socials, youtube: e.target.value } })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: HERO */}
              {settingsTab === "hero" && (
                <div className="space-y-6 max-w-3xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Turkish Texts */}
                    <div className="space-y-4 border-r border-line/20 pr-6">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Türkçe / TR</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Badge (Üst Başlık)</label>
                        <input
                          type="text"
                          value={settings.hero.badge.tr}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, badge: { ...settings.hero.badge, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Ana Başlık</label>
                        <input
                          type="text"
                          value={settings.hero.title.tr}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, title: { ...settings.hero.title, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Alt Metin</label>
                        <textarea
                          rows={4}
                          value={settings.hero.subtitle.tr}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, subtitle: { ...settings.hero.subtitle, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Buton Yazısı</label>
                        <input
                          type="text"
                          value={settings.hero.cta.tr}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, cta: { ...settings.hero.cta, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* English Texts */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">English / EN</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Badge (Upper Title)</label>
                        <input
                          type="text"
                          value={settings.hero.badge.en}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, badge: { ...settings.hero.badge, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Main Title</label>
                        <input
                          type="text"
                          value={settings.hero.title.en}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, title: { ...settings.hero.title, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Subtitle</label>
                        <textarea
                          rows={4}
                          value={settings.hero.subtitle.en}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, subtitle: { ...settings.hero.subtitle, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Button Text</label>
                        <input
                          type="text"
                          value={settings.hero.cta.en}
                          onChange={(e) => updateSettings({
                            hero: { ...settings.hero, cta: { ...settings.hero.cta, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Background Media Upload */}
                  <div className="border-t border-line/30 pt-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Hero Arka Plan Medyası</h4>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="hero-img-radio"
                          name="heromediatype"
                          checked={settings.hero.mediaType === "image"}
                          onChange={() => updateSettings({ hero: { ...settings.hero, mediaType: "image" } })}
                          className="cursor-pointer"
                        />
                        <label htmlFor="hero-img-radio" className="text-xs text-ink cursor-pointer">Görsel / Image</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="hero-vid-radio"
                          name="heromediatype"
                          checked={settings.hero.mediaType === "video"}
                          onChange={() => updateSettings({ hero: { ...settings.hero, mediaType: "video" } })}
                          className="cursor-pointer"
                        />
                        <label htmlFor="hero-vid-radio" className="text-xs text-ink cursor-pointer">Video / Movie</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Medya Kaynağı (URL)</label>
                        <input
                          type="text"
                          value={settings.hero.mediaUrl || settings.hero.mediaSrc || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isVideo = val.match(/\.(mp4|webm|ogg)$/i);
                            updateSettings({
                              hero: {
                                ...settings.hero,
                                mediaSrc: val,
                                mediaUrl: val,
                                mediaType: isVideo ? "video" : "image"
                              }
                            });
                          }}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          id="hero-file-upload"
                          accept={settings.hero.mediaType === "video" ? "video/*" : "image/*"}
                          onChange={(e) => handleHeroMediaUpload(e, settings.hero.mediaType)}
                          className="hidden"
                        />
                        <label
                          htmlFor="hero-file-upload"
                          className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-ink-soft text-bone py-2 px-4 rounded text-xs font-mono font-bold uppercase tracking-widest cursor-pointer transition-colors"
                        >
                          <Upload size={14} />
                          <span>Yeni Yükle</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: SHOWCASE */}
              {settingsTab === "showcase" && (
                <div className="space-y-6 max-w-2xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Türkçe / TR</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Portföy Başlık</label>
                        <input
                          type="text"
                          value={settings.showcaseHeader?.title?.tr || ""}
                          onChange={(e) => updateSettings({
                            showcaseHeader: {
                              ...settings.showcaseHeader,
                              title: { ...settings.showcaseHeader?.title, tr: e.target.value }
                            }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Portföy Alt Açıklama</label>
                        <textarea
                          rows={4}
                          value={settings.showcaseHeader?.subtitle?.tr || ""}
                          onChange={(e) => updateSettings({
                            showcaseHeader: {
                              ...settings.showcaseHeader,
                              subtitle: { ...settings.showcaseHeader?.subtitle, tr: e.target.value }
                            }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">English / EN</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Portfolio Title</label>
                        <input
                          type="text"
                          value={settings.showcaseHeader?.title?.en || ""}
                          onChange={(e) => updateSettings({
                            showcaseHeader: {
                              ...settings.showcaseHeader,
                              title: { ...settings.showcaseHeader?.title, en: e.target.value }
                            }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Portfolio Subtitle</label>
                        <textarea
                          rows={4}
                          value={settings.showcaseHeader?.subtitle?.en || ""}
                          onChange={(e) => updateSettings({
                            showcaseHeader: {
                              ...settings.showcaseHeader,
                              subtitle: { ...settings.showcaseHeader?.subtitle, en: e.target.value }
                            }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: SERVICES */}
              {settingsTab === "services" && (
                <div className="space-y-6 max-w-4xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  {/* Headers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-line/20 pb-4">
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Hizmetler Başlıkları (TR)</h4>
                      <input
                        type="text"
                        value={settings.servicesHeader.title.tr}
                        onChange={(e) => updateSettings({
                          servicesHeader: { ...settings.servicesHeader, title: { ...settings.servicesHeader.title, tr: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="Başlık TR"
                      />
                      <input
                        type="text"
                        value={settings.servicesHeader.subtitle.tr}
                        onChange={(e) => updateSettings({
                          servicesHeader: { ...settings.servicesHeader, subtitle: { ...settings.servicesHeader.subtitle, tr: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="Açıklama TR"
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Services Headers (EN)</h4>
                      <input
                        type="text"
                        value={settings.servicesHeader.title.en}
                        onChange={(e) => updateSettings({
                          servicesHeader: { ...settings.servicesHeader, title: { ...settings.servicesHeader.title, en: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="Başlık EN"
                      />
                      <input
                        type="text"
                        value={settings.servicesHeader.subtitle.en}
                        onChange={(e) => updateSettings({
                          servicesHeader: { ...settings.servicesHeader, subtitle: { ...settings.servicesHeader.subtitle, en: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="Açıklama EN"
                      />
                    </div>
                  </div>

                  {/* List of Services */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ink font-bold">Hizmet Listesi</h4>
                    {settings.services?.map((service, idx) => (
                      <div key={service.id} className="bg-bone border border-line/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={service.title.tr}
                              onChange={(e) => {
                                const current = [...settings.services];
                                current[idx].title.tr = e.target.value;
                                updateSettings({ services: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Başlık TR"
                            />
                            <textarea
                              rows={2}
                              value={service.desc.tr}
                              onChange={(e) => {
                                const current = [...settings.services];
                                current[idx].desc.tr = e.target.value;
                                updateSettings({ services: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Açıklama TR"
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={service.title.en}
                              onChange={(e) => {
                                const current = [...settings.services];
                                current[idx].title.en = e.target.value;
                                updateSettings({ services: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Başlık EN"
                            />
                            <textarea
                              rows={2}
                              value={service.desc.en}
                              onChange={(e) => {
                                const current = [...settings.services];
                                current[idx].desc.en = e.target.value;
                                updateSettings({ services: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Açıklama EN"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-clay hover:text-clay-deep hover:bg-clay/10 rounded cursor-pointer self-end md:self-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Service form */}
                  <form onSubmit={handleAddService} className="border-t border-line/30 pt-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Yeni Hizmet Ekle</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Hizmet Adı (TR)"
                          value={newService.titleTr}
                          onChange={(e) => setNewService({ ...newService, titleTr: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink"
                        />
                        <textarea
                          placeholder="Açıklama (TR)"
                          value={newService.descTr}
                          onChange={(e) => setNewService({ ...newService, descTr: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Service Name (EN - Boşsa TR kopyalanır)"
                          value={newService.titleEn}
                          onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink"
                        />
                        <textarea
                          placeholder="Description (EN - Boşsa TR kopyalanır)"
                          value={newService.descEn}
                          onChange={(e) => setNewService({ ...newService, descEn: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink resize-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-ink hover:bg-ink-soft text-bone text-[10px] font-mono uppercase tracking-widest font-bold px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Hizmet Ekle</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB CONTENT: WHY US */}
              {settingsTab === "whyus" && (
                <div className="space-y-6 max-w-4xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-line/20 pb-6">
                    {/* TR */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Neden Biz Başlıkları (TR)</h4>
                      <input
                        type="text"
                        value={settings.whyUsHeader?.title?.tr || ""}
                        onChange={(e) => updateSettings({
                          whyUsHeader: { ...settings.whyUsHeader, title: { ...settings.whyUsHeader?.title, tr: e.target.value } }
                        })}
                        placeholder="Başlık TR"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <input
                        type="text"
                        value={settings.whyUsHeader?.heading?.tr || ""}
                        onChange={(e) => updateSettings({
                          whyUsHeader: { ...settings.whyUsHeader, heading: { ...settings.whyUsHeader?.heading, tr: e.target.value } }
                        })}
                        placeholder="Büyük Başlık TR"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <textarea
                        rows={3}
                        value={settings.whyUsHeader?.subtitle?.tr || ""}
                        onChange={(e) => updateSettings({
                          whyUsHeader: { ...settings.whyUsHeader, subtitle: { ...settings.whyUsHeader?.subtitle, tr: e.target.value } }
                        })}
                        placeholder="Alt Açıklama TR"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink resize-none"
                      />
                    </div>
                    {/* EN */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Why Us Headers (EN)</h4>
                      <input
                        type="text"
                        value={settings.whyUsHeader?.title?.en || ""}
                        onChange={(e) => updateSettings({
                          whyUsHeader: { ...settings.whyUsHeader, title: { ...settings.whyUsHeader?.title, en: e.target.value } }
                        })}
                        placeholder="Title EN"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <input
                        type="text"
                        value={settings.whyUsHeader?.heading?.en || ""}
                        onChange={(e) => updateSettings({
                          whyUsHeader: { ...settings.whyUsHeader, heading: { ...settings.whyUsHeader?.heading, en: e.target.value } }
                        })}
                        placeholder="Main Heading EN"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <textarea
                        rows={3}
                        value={settings.whyUsHeader?.subtitle?.en || ""}
                        onChange={(e) => updateSettings({
                          whyUsHeader: { ...settings.whyUsHeader, subtitle: { ...settings.whyUsHeader?.subtitle, en: e.target.value } }
                        })}
                        placeholder="Subtitle EN"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ink font-bold">Neden Sunai Studio Listesi</h4>
                    {(settings.whyUsReasons || []).map((reason, idx) => (
                      <div key={reason.id} className="bg-bone border border-line/30 p-4 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={reason.title.tr}
                              onChange={(e) => {
                                const current = [...settings.whyUsReasons];
                                current[idx].title.tr = e.target.value;
                                updateSettings({ whyUsReasons: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Başlık TR"
                            />
                            <textarea
                              rows={2}
                              value={reason.desc.tr}
                              onChange={(e) => {
                                const current = [...settings.whyUsReasons];
                                current[idx].desc.tr = e.target.value;
                                updateSettings({ whyUsReasons: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Açıklama TR"
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={reason.title.en}
                              onChange={(e) => {
                                const current = [...settings.whyUsReasons];
                                current[idx].title.en = e.target.value;
                                updateSettings({ whyUsReasons: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Title EN"
                            />
                            <textarea
                              rows={2}
                              value={reason.desc.en}
                              onChange={(e) => {
                                const current = [...settings.whyUsReasons];
                                current[idx].desc.en = e.target.value;
                                updateSettings({ whyUsReasons: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Description EN"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: BEFORE/AFTER */}
              {settingsTab === "beforeafter" && (
                <div className="space-y-6 max-w-2xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Önce / Sonra (TR)</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Bölüm Başlığı</label>
                        <input
                          type="text"
                          value={settings.beforeAfter?.title?.tr || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, title: { ...settings.beforeAfter?.title, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Alt Açıklama</label>
                        <textarea
                          rows={3}
                          value={settings.beforeAfter?.subtitle?.tr || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, subtitle: { ...settings.beforeAfter?.subtitle, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Orijinal Etiketi</label>
                        <input
                          type="text"
                          value={settings.beforeAfter?.original?.tr || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, original: { ...settings.beforeAfter?.original, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">AI Dokunuşu Etiketi</label>
                        <input
                          type="text"
                          value={settings.beforeAfter?.enhanced?.tr || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, enhanced: { ...settings.beforeAfter?.enhanced, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Before / After (EN)</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Section Title</label>
                        <input
                          type="text"
                          value={settings.beforeAfter?.title?.en || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, title: { ...settings.beforeAfter?.title, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Subtitle</label>
                        <textarea
                          rows={3}
                          value={settings.beforeAfter?.subtitle?.en || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, subtitle: { ...settings.beforeAfter?.subtitle, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Original Label</label>
                        <input
                          type="text"
                          value={settings.beforeAfter?.original?.en || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, original: { ...settings.beforeAfter?.original, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Enhanced Label</label>
                        <input
                          type="text"
                          value={settings.beforeAfter?.enhanced?.en || ""}
                          onChange={(e) => updateSettings({
                            beforeAfter: { ...settings.beforeAfter, enhanced: { ...settings.beforeAfter?.enhanced, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PROCESS */}
              {settingsTab === "process" && (
                <div className="space-y-6 max-w-4xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-line/20 pb-6">
                    {/* TR */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Çalışma Süreci Başlıkları (TR)</h4>
                      <input
                        type="text"
                        value={settings.processHeader?.title?.tr || ""}
                        onChange={(e) => updateSettings({
                          processHeader: { ...settings.processHeader, title: { ...settings.processHeader?.title, tr: e.target.value } }
                        })}
                        placeholder="Başlık TR"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <input
                        type="text"
                        value={settings.processHeader?.heading?.tr || ""}
                        onChange={(e) => updateSettings({
                          processHeader: { ...settings.processHeader, heading: { ...settings.processHeader?.heading, tr: e.target.value } }
                        })}
                        placeholder="Büyük Başlık TR"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <textarea
                        rows={3}
                        value={settings.processHeader?.subtitle?.tr || ""}
                        onChange={(e) => updateSettings({
                          processHeader: { ...settings.processHeader, subtitle: { ...settings.processHeader?.subtitle, tr: e.target.value } }
                        })}
                        placeholder="Alt Açıklama TR"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink resize-none"
                      />
                    </div>
                    {/* EN */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Process Headers (EN)</h4>
                      <input
                        type="text"
                        value={settings.processHeader?.title?.en || ""}
                        onChange={(e) => updateSettings({
                          processHeader: { ...settings.processHeader, title: { ...settings.processHeader?.title, en: e.target.value } }
                        })}
                        placeholder="Title EN"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <input
                        type="text"
                        value={settings.processHeader?.heading?.en || ""}
                        onChange={(e) => updateSettings({
                          processHeader: { ...settings.processHeader, heading: { ...settings.processHeader?.heading, en: e.target.value } }
                        })}
                        placeholder="Main Heading EN"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                      />
                      <textarea
                        rows={3}
                        value={settings.processHeader?.subtitle?.en || ""}
                        onChange={(e) => updateSettings({
                          processHeader: { ...settings.processHeader, subtitle: { ...settings.processHeader?.subtitle, en: e.target.value } }
                        })}
                        placeholder="Subtitle EN"
                        className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ink font-bold">Çalışma Süreci Adımları</h4>
                    {(settings.processSteps || []).map((step, idx) => (
                      <div key={step.id} className="bg-bone border border-line/30 p-4 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={step.badge.tr}
                              onChange={(e) => {
                                const current = [...settings.processSteps];
                                current[idx].badge.tr = e.target.value;
                                updateSettings({ processSteps: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-brass font-mono uppercase font-bold"
                              placeholder="Etiket TR (Örn: Adım 01 / Briefing)"
                            />
                            <input
                              type="text"
                              value={step.title.tr}
                              onChange={(e) => {
                                const current = [...settings.processSteps];
                                current[idx].title.tr = e.target.value;
                                updateSettings({ processSteps: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Başlık TR"
                            />
                            <textarea
                              rows={2}
                              value={step.desc.tr}
                              onChange={(e) => {
                                const current = [...settings.processSteps];
                                current[idx].desc.tr = e.target.value;
                                updateSettings({ processSteps: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Açıklama TR"
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={step.badge.en}
                              onChange={(e) => {
                                const current = [...settings.processSteps];
                                current[idx].badge.en = e.target.value;
                                updateSettings({ processSteps: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-brass font-mono uppercase font-bold"
                              placeholder="Badge EN"
                            />
                            <input
                              type="text"
                              value={step.title.en}
                              onChange={(e) => {
                                const current = [...settings.processSteps];
                                current[idx].title.en = e.target.value;
                                updateSettings({ processSteps: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Title EN"
                            />
                            <textarea
                              rows={2}
                              value={step.desc.en}
                              onChange={(e) => {
                                const current = [...settings.processSteps];
                                current[idx].desc.en = e.target.value;
                                updateSettings({ processSteps: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Description EN"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: TESTIMONIALS */}
              {settingsTab === "testimonials" && (
                <div className="space-y-6 max-w-4xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  {/* Headers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-line/20 pb-4">
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Referans Başlıkları (TR)</h4>
                      <input
                        type="text"
                        value={settings.testimonialsHeader.title.tr}
                        onChange={(e) => updateSettings({
                          testimonialsHeader: { ...settings.testimonialsHeader, title: { ...settings.testimonialsHeader.title, tr: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        value={settings.testimonialsHeader.subtitle.tr}
                        onChange={(e) => updateSettings({
                          testimonialsHeader: { ...settings.testimonialsHeader, subtitle: { ...settings.testimonialsHeader.subtitle, tr: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Testimonials Headers (EN)</h4>
                      <input
                        type="text"
                        value={settings.testimonialsHeader.title.en}
                        onChange={(e) => updateSettings({
                          testimonialsHeader: { ...settings.testimonialsHeader, title: { ...settings.testimonialsHeader.title, en: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        value={settings.testimonialsHeader.subtitle.en}
                        onChange={(e) => updateSettings({
                          testimonialsHeader: { ...settings.testimonialsHeader, subtitle: { ...settings.testimonialsHeader.subtitle, en: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* List of Testimonials */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ink font-bold">Müşteri Yorumları</h4>
                    {settings.testimonials?.map((testimonial, idx) => (
                      <div key={testimonial.id} className="bg-bone border border-line/30 p-4 rounded-xl flex flex-col gap-4 justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={testimonial.quote.tr}
                              onChange={(e) => {
                                const current = [...settings.testimonials];
                                current[idx].quote.tr = e.target.value;
                                updateSettings({ testimonials: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Yorum TR"
                            />
                            <input
                              type="text"
                              value={testimonial.title.tr}
                              onChange={(e) => {
                                const current = [...settings.testimonials];
                                current[idx].title.tr = e.target.value;
                                updateSettings({ testimonials: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink"
                              placeholder="Ünvan / Pozisyon TR"
                            />
                          </div>
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={testimonial.quote.en}
                              onChange={(e) => {
                                const current = [...settings.testimonials];
                                current[idx].quote.en = e.target.value;
                                updateSettings({ testimonials: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Quote EN"
                            />
                            <input
                              type="text"
                              value={testimonial.title.en}
                              onChange={(e) => {
                                const current = [...settings.testimonials];
                                current[idx].title.en = e.target.value;
                                updateSettings({ testimonials: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink"
                              placeholder="Position / Title EN"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-line/10">
                          <div>
                            <label className="text-[9px] font-mono uppercase text-stone block">Yazar / Müşteri</label>
                            <input
                              type="text"
                              value={testimonial.author}
                              onChange={(e) => {
                                const current = [...settings.testimonials];
                                current[idx].author = e.target.value;
                                updateSettings({ testimonials: current });
                              }}
                              className="bg-cream border border-line/40 rounded px-2 py-0.5 text-xs font-bold text-ink"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="p-2 text-clay hover:text-clay-deep hover:bg-clay/10 rounded cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Testimonial form */}
                  <form onSubmit={handleAddTestimonial} className="border-t border-line/30 pt-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Yeni Yorum Ekle</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <textarea
                          required
                          placeholder="Müşteri Yorumu (TR)"
                          value={newTestimonial.quoteTr}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, quoteTr: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink resize-none"
                        />
                        <input
                          type="text"
                          placeholder="Müşteri Ünvanı / Pozisyonu (TR)"
                          value={newTestimonial.titleTr}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, titleTr: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink"
                        />
                      </div>
                      <div className="space-y-2">
                        <textarea
                          placeholder="Quote (EN - Boşsa TR kopyalanır)"
                          value={newTestimonial.quoteEn}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, quoteEn: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink resize-none"
                        />
                        <input
                          type="text"
                          placeholder="Position / Corporate Title (EN)"
                          value={newTestimonial.titleEn}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, titleEn: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone mb-1">Müşteri / Yazar Adı</label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Melis Yılmaz"
                        value={newTestimonial.author}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                        className="bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink w-full md:w-80"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-ink hover:bg-ink-soft text-bone text-[10px] font-mono uppercase tracking-widest font-bold px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Yorum Ekle</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB CONTENT: FAQS */}
              {settingsTab === "faqs" && (
                <div className="space-y-6 max-w-4xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  {/* Headers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-line/20 pb-4">
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">SSS Başlıkları (TR)</h4>
                      <input
                        type="text"
                        value={settings.faqsHeader.title.tr}
                        onChange={(e) => updateSettings({
                          faqsHeader: { ...settings.faqsHeader, title: { ...settings.faqsHeader.title, tr: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        value={settings.faqsHeader.subtitle.tr}
                        onChange={(e) => updateSettings({
                          faqsHeader: { ...settings.faqsHeader, subtitle: { ...settings.faqsHeader.subtitle, tr: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">FAQs Headers (EN)</h4>
                      <input
                        type="text"
                        value={settings.faqsHeader.title.en}
                        onChange={(e) => updateSettings({
                          faqsHeader: { ...settings.faqsHeader, title: { ...settings.faqsHeader.title, en: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        value={settings.faqsHeader.subtitle.en}
                        onChange={(e) => updateSettings({
                          faqsHeader: { ...settings.faqsHeader, subtitle: { ...settings.faqsHeader.subtitle, en: e.target.value } }
                        })}
                        className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* List of FAQS */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ink font-bold">Soru-Cevap Listesi</h4>
                    {settings.faqs?.map((faq, idx) => (
                      <div key={faq.id} className="bg-bone border border-line/30 p-4 rounded-xl flex flex-col gap-4 justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* TR */}
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={faq.q.tr}
                              onChange={(e) => {
                                const current = [...settings.faqs];
                                current[idx].q.tr = e.target.value;
                                updateSettings({ faqs: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Soru TR"
                            />
                            <textarea
                              rows={3}
                              value={faq.a.tr}
                              onChange={(e) => {
                                const current = [...settings.faqs];
                                current[idx].a.tr = e.target.value;
                                updateSettings({ faqs: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Cevap TR"
                            />
                          </div>
                          {/* EN */}
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={faq.q.en}
                              onChange={(e) => {
                                const current = [...settings.faqs];
                                current[idx].q.en = e.target.value;
                                updateSettings({ faqs: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs font-bold text-ink"
                              placeholder="Question EN"
                            />
                            <textarea
                              rows={3}
                              value={faq.a.en}
                              onChange={(e) => {
                                const current = [...settings.faqs];
                                current[idx].a.en = e.target.value;
                                updateSettings({ faqs: current });
                              }}
                              className="w-full bg-cream border border-line/40 rounded px-2.5 py-1 text-xs text-ink resize-none"
                              placeholder="Answer EN"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-line/10">
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-2 text-clay hover:text-clay-deep hover:bg-clay/10 rounded cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add FAQ form */}
                  <form onSubmit={handleAddFaq} className="border-t border-line/30 pt-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Yeni Soru-Cevap Ekle</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Soru (TR)"
                          value={newFaq.qTr}
                          onChange={(e) => setNewFaq({ ...newFaq, qTr: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink"
                        />
                        <textarea
                          required
                          placeholder="Cevap (TR)"
                          value={newFaq.aTr}
                          onChange={(e) => setNewFaq({ ...newFaq, aTr: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Question (EN - Boşsa TR kopyalanır)"
                          value={newFaq.qEn}
                          onChange={(e) => setNewFaq({ ...newFaq, qEn: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink"
                        />
                        <textarea
                          placeholder="Answer (EN - Boşsa TR kopyalanır)"
                          value={newFaq.aEn}
                          onChange={(e) => setNewFaq({ ...newFaq, aEn: e.target.value })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-1.5 text-xs text-ink resize-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-ink hover:bg-ink-soft text-bone text-[10px] font-mono uppercase tracking-widest font-bold px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Soru Ekle</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB CONTENT: CONTACT */}
              {settingsTab === "contact" && (
                <div className="space-y-6 max-w-2xl bg-cream/30 p-6 border border-line/30 rounded-xl2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">İletişim Başlıkları (TR)</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Küçük Başlık</label>
                        <input
                          type="text"
                          value={settings.contactHeader?.title?.tr || ""}
                          onChange={(e) => updateSettings({
                            contactHeader: { ...settings.contactHeader, title: { ...settings.contactHeader?.title, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Büyük Başlık</label>
                        <input
                          type="text"
                          value={settings.contactHeader?.heading?.tr || ""}
                          onChange={(e) => updateSettings({
                            contactHeader: { ...settings.contactHeader, heading: { ...settings.contactHeader?.heading, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Alt Açıklama</label>
                        <textarea
                          rows={3}
                          value={settings.contactHeader?.subtitle?.tr || ""}
                          onChange={(e) => updateSettings({
                            contactHeader: { ...settings.contactHeader, subtitle: { ...settings.contactHeader?.subtitle, tr: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">Contact Headers (EN)</h4>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Upper Title</label>
                        <input
                          type="text"
                          value={settings.contactHeader?.title?.en || ""}
                          onChange={(e) => updateSettings({
                            contactHeader: { ...settings.contactHeader, title: { ...settings.contactHeader?.title, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Main Heading</label>
                        <input
                          type="text"
                          value={settings.contactHeader?.heading?.en || ""}
                          onChange={(e) => updateSettings({
                            contactHeader: { ...settings.contactHeader, heading: { ...settings.contactHeader?.heading, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone mb-1">Subtitle</label>
                        <textarea
                          rows={3}
                          value={settings.contactHeader?.subtitle?.en || ""}
                          onChange={(e) => updateSettings({
                            contactHeader: { ...settings.contactHeader, subtitle: { ...settings.contactHeader?.subtitle, en: e.target.value } }
                          })}
                          className="w-full bg-bone border border-line/50 rounded px-3 py-2 text-xs text-ink resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeSector ? (
            /* INDIVIDUAL PORTFOLIO CATEGORY EDITOR (Existing code logic, perfectly styled) */
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-line/30 pb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeSector.accent }}
                  />
                  <h2 className="font-display text-3xl font-bold text-ink">
                    {activeSector.name.tr}
                  </h2>
                </div>
                <p className="font-sans text-stone text-sm">
                  {activeSector.tagline.tr}
                </p>
              </div>

              {/* Media Upload Options */}
              <div className="bg-cream/45 border border-line/35 p-6 rounded-xl2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Upload */}
                <div className="border border-dashed border-line/60 rounded-lg p-6 text-center space-y-3 bg-bone/30">
                  <ImageIcon className="w-8 h-8 text-stone mx-auto" />
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-ink text-sm">Görsel / Fotoğraf Yükle</p>
                    <p className="font-sans text-stone text-[11px]">Cloudinary'ye doğrudan yüklenir</p>
                  </div>
                  <input
                    type="file"
                    id="img-upload"
                    multiple
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => handleMediaUpload(e, "image")}
                    className="hidden"
                  />
                  <label
                    htmlFor="img-upload"
                    className="inline-flex items-center gap-2 bg-ink text-bone hover:bg-ink-soft text-[10px] font-sans uppercase tracking-widest font-bold px-4 py-2 rounded cursor-pointer transition-colors"
                  >
                    <Upload size={12} className="w-3 h-3" />
                    <span>Dosya Seç</span>
                  </label>
                </div>

                {/* Video Upload */}
                <div className="border border-dashed border-line/60 rounded-lg p-6 text-center space-y-3 bg-bone/30">
                  <Video className="w-8 h-8 text-stone mx-auto" />
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-ink text-sm">Video / Film Yükle</p>
                    <p className="font-sans text-stone text-[11px]">Doğrudan imza bypass</p>
                  </div>
                  <input
                    type="file"
                    id="vid-upload"
                    multiple
                    accept="video/*"
                    disabled={uploading}
                    onChange={(e) => handleMediaUpload(e, "video")}
                    className="hidden"
                  />
                  <label
                    htmlFor="vid-upload"
                    className="inline-flex items-center gap-2 bg-ink text-bone hover:bg-ink-soft text-[10px] font-sans uppercase tracking-widest font-bold px-4 py-2 rounded cursor-pointer transition-colors"
                  >
                    <Upload size={12} className="w-3 h-3" />
                    <span>Dosya Seç</span>
                  </label>
                </div>
              </div>

              {/* Videos Table */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-ink font-bold border-b border-line/30 pb-2">
                  Videolar / Campaigns ({sortedVideos.length})
                </h3>
                {sortedVideos.length === 0 ? (
                  <p className="text-stone text-xs italic py-4">Bu kategori için video bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {sortedVideos.map((media, idx) => (
                      <div
                        key={media.id}
                        className={`flex items-center justify-between p-4 rounded-xl border bg-cream/35 border-line/30 transition-all ${
                          activeOverride.hidden?.includes(media.id) ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <video
                            src={media.src}
                            className="w-14 h-14 rounded object-cover border border-line/50"
                          />
                          <div className="flex-1 max-w-md">
                            <input
                              type="text"
                              value={media.title?.tr || ""}
                              onChange={(e) => handleTitleChange(media.id, e.target.value)}
                              placeholder="Medya Başlığı / Title"
                              className="w-full bg-bone border border-line/40 rounded px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-brass"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveMedia(sortedVideos, idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 text-stone hover:text-ink hover:bg-line/25 rounded transition-all disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp size={14} className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveMedia(sortedVideos, idx, "down")}
                            disabled={idx === sortedVideos.length - 1}
                            className="p-1.5 text-stone hover:text-ink hover:bg-line/25 rounded transition-all disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown size={14} className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleVisibility(media.id)}
                            className="p-1.5 text-stone hover:text-ink hover:bg-line/25 rounded transition-all cursor-pointer"
                          >
                            {activeOverride.hidden?.includes(media.id) ? <EyeOff size={14} className="w-3.5 h-3.5" /> : <Eye size={14} className="w-3.5 h-3.5" />}
                          </button>
                          {media.isAdded && (
                            <button
                              onClick={() => deleteMedia(media.id)}
                              className="p-1.5 text-clay hover:text-clay-deep hover:bg-clay/10 rounded transition-all cursor-pointer"
                            >
                              <Trash2 size={14} className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Images Table */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-ink font-bold border-b border-line/30 pb-2">
                  Görseller / Visuals ({sortedImages.length})
                </h3>
                {sortedImages.length === 0 ? (
                  <p className="text-stone text-xs italic py-4">Bu kategori için görsel bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {sortedImages.map((media, idx) => (
                      <div
                        key={media.id}
                        className={`flex items-center justify-between p-4 rounded-xl border bg-cream/35 border-line/30 transition-all ${
                          activeOverride.hidden?.includes(media.id) ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={media.src}
                            alt=""
                            className="w-14 h-14 rounded object-cover border border-line/50"
                          />
                          <div className="flex-1 max-w-md">
                            <input
                              type="text"
                              value={media.title?.tr || ""}
                              onChange={(e) => handleTitleChange(media.id, e.target.value)}
                              placeholder="Medya Başlığı / Title"
                              className="w-full bg-bone border border-line/40 rounded px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-brass"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveMedia(sortedImages, idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 text-stone hover:text-ink hover:bg-line/25 rounded transition-all disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp size={14} className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveMedia(sortedImages, idx, "down")}
                            disabled={idx === sortedImages.length - 1}
                            className="p-1.5 text-stone hover:text-ink hover:bg-line/25 rounded transition-all disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown size={14} className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleVisibility(media.id)}
                            className="p-1.5 text-stone hover:text-ink hover:bg-line/25 rounded transition-all cursor-pointer"
                          >
                            {activeOverride.hidden?.includes(media.id) ? <EyeOff size={14} className="w-3.5 h-3.5" /> : <Eye size={14} className="w-3.5 h-3.5" />}
                          </button>
                          {media.isAdded && (
                            <button
                              onClick={() => deleteMedia(media.id)}
                              className="p-1.5 text-clay hover:text-clay-deep hover:bg-clay/10 rounded transition-all cursor-pointer"
                            >
                              <Trash2 size={14} className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-stone text-sm">Lütfen düzenlemek istediğiniz bir alan seçin.</p>
          )}
        </main>
      </div>
    </div>
  );
}
