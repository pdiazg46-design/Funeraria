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
    <form action={formAction} className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Modificar Tarifa Plana Global RM</label>
      <p className="text-[10px] text-slate-600 mb-3 leading-tight italic">Al modificar esto, cambiará el valor base de logística para <strong>todos</strong> los servicios futuros dentro de RM.</p>
      <div className="flex gap-2">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
          <input 
            type="text" 
            name="tarifaPlanaRM_CLP" 
            value={val}
            onChange={handleChange}
            className="w-full border-slate-700 rounded-xl shadow-sm py-2 pl-7 pr-3 bg-slate-900 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-amber-500 font-mono focus:outline-none transition-colors" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-slate-800 text-slate-300 px-4 rounded-xl hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-colors text-[10px] font-bold uppercase tracking-widest border border-slate-700 w-[120px] flex justify-center items-center shrink-0"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "FIJAR TARIFA RM"}
        </button>
      </div>
    </form>
  );
}
