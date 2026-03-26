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
        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-wide">Gestión de Servicios</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table-fixed w-full min-w-[900px] divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-24">Fecha</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/4">Cliente</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/4">Origen - Destino</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-32">Estado</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/5">Proveedor</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest w-20">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {servicios.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 italic">No hay servicios registrados.</td>
                </tr>
              )}
              {servicios.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                    {s.createdAt.toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900 uppercase tracking-wide truncate">
                    {s.cliente?.nombre || s.cliente?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-amber-600 uppercase tracking-wider font-medium truncate">
                    {s.origen?.nombre} &rarr; {s.destino1?.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                    <span className={`px-2 py-1 inline-flex text-[9px] uppercase tracking-widest font-bold rounded-md border 
                      ${s.estado === 'NUEVO_INGRESO' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                      s.estado === 'EN_CURSO' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                      s.estado === 'FINALIZADO' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-600 uppercase tracking-wider truncate">
                    {s.proveedor?.nombreEmpresa || <span className="text-red-600 text-[10px] uppercase tracking-widest border border-red-200 bg-red-50 px-2 py-0.5 rounded-md">Sin Asignar</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <Link href={`/admin/servicios/${s.id}`} className="text-slate-400 hover:text-amber-500 p-2 inline-block rounded-lg hover:bg-slate-50 transition-colors">
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
