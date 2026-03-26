import { prisma } from "@/lib/prisma";
import { createCatalogo, deleteCatalogo, updateCatalogo } from "./actions";
import { Plus, Trash2, Edit, X } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit ? parseInt(params.edit) : null;
  
  let editItem = null;
  if (editId) {
    editItem = await prisma.catalogoAtaudes.findUnique({ where: { id: editId } });
  }

  const catalogos = await prisma.catalogoAtaudes.findMany({
    orderBy: { id: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-white tracking-wide">Catálogo de Ataúdes</h2>
      </div>

      {/* Formulario de creación / Edición */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-serif text-amber-500">
            {editItem ? "Editar Producto Referencial" : "Agregar Nuevo Producto"}
          </h3>
          {editItem && (
            <Link href="/admin/catalogo" className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-bold tracking-widest uppercase transition-colors">
              <X className="w-4 h-4" /> Cancelar
            </Link>
          )}
        </div>
        <form action={editItem ? updateCatalogo.bind(null, editItem.id) : createCatalogo} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Nombre</label>
            <input required type="text" name="nombre" defaultValue={editItem?.nombre || ""} className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors" placeholder="EJ. URNA MADERA" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Material</label>
            <input required type="text" name="material" defaultValue={editItem?.material || ""} className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors" placeholder="EJ. ROBLE" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Precio Base (CLP)</label>
            <input required type="number" name="precioBaseCLP" defaultValue={editItem?.precioBaseCLP || ""} className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-600 focus:outline-none transition-colors" placeholder="150000" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Foto / Referencia</label>
            <input type="text" name="imagenUrl" defaultValue={editItem?.imagenUrl || ""} className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-300 placeholder-slate-600 focus:outline-none transition-colors font-mono text-xs" placeholder="/Plan I.jpeg" />
          </div>
          <button type="submit" className="bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 h-12 font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            {editItem ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editItem ? "Guardar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* Listado */}
      <div className="bg-slate-900/50 rounded-2xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 flex-1">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Material</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Precio Base</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {catalogos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 italic">No hay productos registrados en el catálogo.</td>
                </tr>
              )}
              {catalogos.map((item: any) => {
                const deleteAction = deleteCatalogo.bind(null, item.id);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-500 font-mono">#{item.id}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-200 uppercase tracking-wide">{item.nombre}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 uppercase tracking-wider">{item.material}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-amber-500 tracking-wider">
                      ${item.precioBaseCLP.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                      <Link href={`/admin/catalogo?edit=${item.id}`} className="text-slate-500 hover:text-amber-400 p-2 inline-block rounded-lg hover:bg-slate-800 transition-colors" title="Editar Producto">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteAction} className="inline ml-1">
                        <button type="submit" className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Eliminar Producto">
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
