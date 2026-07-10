"use client";

import { useState, useTransition } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      const result = await login(password);
      if (result && result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bone">
      <div className="w-full max-w-md bg-cream/70 backdrop-blur border border-line/45 rounded-xl2 p-8 shadow-kx space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-ink">sunai.studio</h1>
          <p className="font-mono text-[9px] uppercase tracking-widest text-stone">Yönetici Girişi / Admin Login</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-stone mb-2">Parola / Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bone/50 border border-line/50 rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder-stone-soft focus:outline-none focus:border-brass transition-colors"
            />
          </div>

          {error && <p className="text-clay text-xs font-sans">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-clay hover:bg-clay-deep text-bone font-sans text-xs uppercase tracking-widest py-4 rounded-full font-bold transition-all duration-300 disabled:opacity-50 active:scale-[0.97] border border-clay hover:border-clay-deep cursor-pointer"
          >
            {isPending ? "Giriş Yapılıyor..." : "Giriş Yap / Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
