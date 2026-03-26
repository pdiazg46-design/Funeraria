import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const servicios = await prisma.servicioFunerario.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      cliente: true,
      proveedor: true,
      origen: true,
      destino1: true
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-white tracking-wide">Gestión de Servicios</h2>
      </div>

      <div className="bg-slate-900/50 rounded-2xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 flex-1">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Origen - Destino</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Proveedor</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {servicios.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 italic">No hay servicios registrados.</td>
                </tr>
              )}
              {servicios.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 font-mono">
                    {s.createdAt.toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-200 uppercase tracking-wide">
                    {s.cliente?.nombre || s.cliente?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-amber-500 uppercase tracking-wider font-medium">
                    {s.origen?.nombre} &rarr; {s.destino1?.nombre}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">
                    <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-widest font-bold rounded-md border 
                      ${s.estado === 'NUEVO_INGRESO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 
                      s.estado === 'EN_CURSO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                      s.estado === 'FINALIZADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                      'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-300 uppercase tracking-wider">
                    {s.proveedor?.nombreEmpresa || <span className="text-red-400/80 text-[10px] uppercase tracking-widest border border-red-500/20 bg-red-500/10 px-2 py-1 rounded-md">Sin Asignar</span>}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                    <Link href={`/admin/servicios/${s.id}`} className="text-slate-500 hover:text-amber-400 p-2 inline-block rounded-lg hover:bg-slate-800 transition-colors">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
