"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-widest text-left"
    >
      <LogOut className="w-4 h-4" /> Cerrar Sesión
    </button>
  );
}
