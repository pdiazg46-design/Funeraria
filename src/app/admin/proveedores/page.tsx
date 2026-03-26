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
        <h2 className="text-3xl font-serif text-white tracking-wide">Gestión de Proveedores</h2>
      </div>

      {/* Formulario de creación */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
        <h3 className="text-lg font-serif mb-5 text-amber-500">Registrar Nuevo Proveedor</h3>
        <form action={createProveedor} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Empresa</label>
            <input required type="text" name="nombreEmpresa" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors" placeholder="EJ. FUNERARIA HOGAR" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">RUT Empresa</label>
            <input required type="text" name="rutEmpresa" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors" placeholder="76.000.000-0" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Contacto</label>
            <input required type="text" name="contacto" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors" placeholder="+56 9..." />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Comuna Base</label>
            <select required name="comunaBaseId" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors">
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
      <div className="bg-slate-900/50 rounded-2xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 flex-1">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">RUT</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contacto</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comuna Base</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {proveedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 italic">No hay proveedores registrados.</td>
                </tr>
              )}
              {proveedores.map((item: any) => {
                const deleteAction = deleteProveedor.bind(null, item.id);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-200 uppercase tracking-wide">{item.nombreEmpresa}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 font-mono tracking-wider">{item.rutEmpresa}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 font-mono">{item.contacto}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-amber-500 font-bold uppercase tracking-wider">
                      {String(comunasMap.get(item.comunaBaseId) || `ID ${item.comunaBaseId}`)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                      <form action={deleteAction} className="inline">
                        <button type="submit" className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Eliminar">
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
