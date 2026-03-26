"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { Lock, User, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError("Credenciales inválidas o acceso denegado.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-200">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mx-auto w-16 h-16 bg-slate-900 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-900/50">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-serif text-white tracking-widest mb-2">B&D Funerales</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Acceso Administrativo Seguro</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center mb-6 animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Correo Electrónico</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 focus:outline-none transition-all placeholder-slate-600 text-sm font-medium"
                  placeholder="ejemplo@atsit.cl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 focus:outline-none transition-all placeholder-slate-600 text-sm font-medium tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-amber-500 text-slate-950 font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)] flex justify-center items-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> VERIFICANDO...</> : 'INGRESAR AL SISTEMA'}
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-mono">
              © 2026 Plataforma de Corretaje Funerario. Sistema encriptado de punta a punta.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex justify-center items-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
