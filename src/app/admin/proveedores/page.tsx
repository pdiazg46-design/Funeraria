import { prisma } from "@/lib/prisma";
import { createProveedor, deleteProveedor } from "./actions";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage() {
  const proveedores = await prisma.proveedor.findMany({
    orderBy: { nombreEmpresa: "asc" }
  });

  const comunas = await prisma.comuna.findMany({ orderBy: { nombre: 'asc'} });
  const comunasMap = new Map(comunas.map((c: any) => [c.id, c.nombre]));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-wide">Gestión de Proveedores</h2>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg md:text-xl font-serif mb-6 text-amber-500">Registrar Nuevo Proveedor</h3>
        <form action={createProveedor} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Empresa</label>
            <input required type="text" name="nombreEmpresa" className="w-full border-slate-300 rounded-xl shadow-inner p-3 bg-slate-50 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors" placeholder="EJ. FUNERARIA HOGAR" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">RUT Empresa</label>
            <input required type="text" name="rutEmpresa" className="w-full border-slate-300 rounded-xl shadow-inner p-3 bg-slate-50 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors" placeholder="76.000.000-0" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Contacto</label>
            <input required type="text" name="contacto" className="w-full border-slate-300 rounded-xl shadow-inner p-3 bg-slate-50 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors" placeholder="+56 9..." />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Comuna Base</label>
            <select required name="comunaBaseId" className="w-full border-slate-300 rounded-xl shadow-inner p-3 bg-slate-50 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors">
              <option value="">Selecciona Comuna</option>
              {comunas.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 h-12 font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.2)] w-full">
            <Plus className="w-4 h-4" /> Registrar
          </button>
        </form>
      </div>

      {/* Listado */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table-fixed w-full min-w-[700px] divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/4">Empresa</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/5">RUT</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/5">Contacto</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/5">Comuna Base</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {proveedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 italic">No hay proveedores registrados.</td>
                </tr>
              )}
              {proveedores.map((item: any) => {
                const deleteAction = deleteProveedor.bind(null, item.id);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900 uppercase tracking-wide truncate">{item.nombreEmpresa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono tracking-wider truncate">{item.rutEmpresa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono truncate">{item.contacto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-amber-600 font-bold uppercase tracking-wider truncate">
                      {String(comunasMap.get(item.comunaBaseId) || `ID ${item.comunaBaseId}`)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <form action={deleteAction} className="inline">
                        <button type="submit" className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
