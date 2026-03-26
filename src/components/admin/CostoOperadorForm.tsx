"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { actualizarCostoOperador } from "@/app/admin/servicios/actions";

export default function CostoOperadorForm({ defaultTarifa, servicioId }: { defaultTarifa: number, servicioId: string }) {
  const [val, setVal] = useState(defaultTarifa > 0 ? defaultTarifa.toLocaleString('es-CL') : "");
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setVal("");
      return;
    }
    setVal(parseInt(raw).toLocaleString('es-CL'));
  };

  const formAction = async (formData: FormData) => {
    setIsPending(true);
    try {
      const tarifaClean = parseInt(val.replace(/\D/g, ""));
      await actualizarCostoOperador(servicioId, tarifaClean);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={formAction} className="flex gap-2 items-center mt-2">
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
        <input 
          type="text" 
          name="costoOperadorCLP" 
          value={val}
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          placeholder="0"
          className="w-full border-slate-700 rounded-xl shadow-sm py-2 pl-7 pr-3 bg-slate-950 border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-emerald-400 font-mono font-bold focus:outline-none transition-colors" 
        />
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        className="bg-slate-800 text-slate-300 px-6 py-2 rounded-xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-colors text-[10px] font-bold uppercase tracking-widest border border-slate-700 shrink-0 h-[42px] flex items-center justify-center"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "FIJAR TARIFA"}
      </button>
    </form>
  );
}
