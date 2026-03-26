"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { actualizarTarifaPlanaGlobal } from "@/app/admin/servicios/actions";

export default function TarifaPlanaForm({ defaultTarifa, servicioId }: { defaultTarifa: number, servicioId: string }) {
  const [val, setVal] = useState(defaultTarifa.toLocaleString('es-CL'));
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
      formData.set("tarifaPlanaRM_CLP", val.replace(/\D/g, ""));
      // The action is already imported, we can call it directly
      await actualizarTarifaPlanaGlobal(servicioId, formData);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={formAction} className="flex gap-2 items-center">
      <div className="relative w-32 md:w-40">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
        <input 
          type="text" 
          name="tarifaPlanaRM_CLP" 
          value={val}
          onChange={handleChange}
          className="w-full border-amber-500/30 rounded-lg shadow-sm py-1.5 pl-7 pr-2 bg-amber-500/10 border focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-amber-400 font-bold font-mono focus:outline-none transition-colors text-sm" 
        />
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-colors text-[9px] font-bold uppercase tracking-widest border border-slate-700 flex justify-center items-center shrink-0 h-full"
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "FIJAR TARIFA"}
      </button>
    </form>
  );
}
