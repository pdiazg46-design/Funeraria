import { prisma } from "@/lib/prisma";
import { createCatalogo, deleteCatalogo, updateCatalogo } from "./actions";
import { Plus, Trash2, Edit, X } from "lucide-react";
import Link from "next/link";
import { default as ImageUploader } from "@/components/admin/ImageUploader";

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

      {/* Formatos condicionales de Creación vs Edición Visual */}
      {editItem ? (
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 overflow-hidden mb-8">
          <div className="bg-amber-500/10 px-6 py-4 border-b border-amber-500/20 flex justify-between items-center">
            <h3 className="text-lg font-serif text-amber-500 flex items-center gap-2">
              <Edit className="w-5 h-5"/> Editando Producto
            </h3>
            <Link href="/admin/catalogo" className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-bold tracking-widest uppercase transition-colors px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:shadow-lg">
              <X className="w-4 h-4" /> Cancelar
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Lado Izquierdo: Vista Previa */}
            <div className="lg:col-span-4 p-6 bg-slate-950 border-r border-slate-800 flex flex-col items-center justify-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Vista Previa Cliente</p>
              <div className="w-full max-w-[280px] rounded-xl border-2 border-amber-500 bg-slate-900 overflow-hidden shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] relative">
                <div className="h-32 w-full relative border-b border-slate-800">
                  <img src={editItem.imagenUrl || "/Plan II.jpeg"} alt={editItem.nombre} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-serif text-base text-white mb-1 uppercase tracking-wide">{editItem.nombre || "Nombre Producto"}</h4>
                  <p className="text-amber-500 font-bold text-xl mb-3 tracking-widest">${(editItem.precioBaseCLP).toLocaleString('es-CL')}</p>
                  <span className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-md text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                    {editItem.material || "Material"}
                  </span>
                  {editItem.descripcion && (
                    <div className="mt-4 pt-4 border-t border-slate-800/50">
                      <p className="text-slate-400 text-xs leading-relaxed italic">"{editItem.descripcion}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Lado Derecho: Formulario */}
            <div className="lg:col-span-8 p-6 lg:p-8">
              <form action={updateCatalogo.bind(null, editItem.id)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Nombre del Plan / Urna</label>
                    <input required type="text" name="nombre" defaultValue={editItem.nombre} className="w-full border-slate-700 rounded-xl p-3 bg-slate-950 border focus:border-amber-500 text-white focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Descripción Completa (Opcional)</label>
                    <textarea name="descripcion" defaultValue={editItem.descripcion || ""} rows={3} className="w-full border-slate-700 rounded-xl p-3 bg-slate-950 border focus:border-amber-500 text-slate-300 focus:outline-none text-sm" placeholder="Ej: Urna tallada a mano con interior de seda..."></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Material</label>
                    <input required type="text" name="material" defaultValue={editItem.material} className="w-full border-slate-700 rounded-xl p-3 bg-slate-950 border focus:border-amber-500 text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Precio Base (CLP)</label>
                    <input required type="number" name="precioBaseCLP" defaultValue={editItem.precioBaseCLP} className="w-full border-slate-700 rounded-xl p-3 bg-slate-950 border focus:border-amber-500 text-amber-500 font-bold focus:outline-none" />
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-end">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Fotografía del Producto (Opcional)</label>
                    <ImageUploader defaultValue={editItem.imagenUrl || ""} />
                    <p className="text-[9px] text-slate-500 mt-2 italic leading-tight">💡 Click para subir imagen directa. Se optimizará automáticamente para no saturar tu base de datos.</p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-amber-500 text-slate-950 px-8 py-3 rounded-xl hover:bg-amber-400 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Edit className="w-4 h-4" /> Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 mb-8">
          <h3 className="text-lg font-serif mb-5 text-amber-500">Agregar Nuevo Producto</h3>
          <form action={createCatalogo} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Nombre</label>
              <input required type="text" name="nombre" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 text-white focus:outline-none" placeholder="EJ. URNA MADERA" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Material</label>
              <input required type="text" name="material" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 text-white focus:outline-none" placeholder="EJ. ROBLE" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Precio Base</label>
              <input required type="number" name="precioBaseCLP" className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 text-white focus:outline-none" placeholder="150000" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Descripción (Opcional)</label>
              <input type="text" name="descripcion" className="w-full border-slate-700 rounded-xl p-3 bg-slate-950 border focus:border-amber-500 text-slate-300 focus:outline-none" placeholder="Descripción breve..." />
            </div>
            <div className="md:col-span-2 flex flex-col justify-end">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Fotografía (Opcional)</label>
              <ImageUploader />
            </div>
            <div className="md:col-span-1 flex flex-col justify-end">
              <button type="submit" className="bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 px-4 py-3 min-h-[95px] w-full flex flex-col items-center justify-center gap-2 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Plus className="w-5 h-5 mb-1" /> Nuevo
              </button>
            </div>
          </form>
        </div>
      )}

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
