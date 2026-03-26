import { prisma } from "@/lib/prisma";
import { createCatalogo, deleteCatalogo } from "./actions";
import { Plus, Trash2 } from "lucide-react";

export default async function CatalogoPage() {
  const catalogos = await prisma.catalogoAtaudes.findMany({
    orderBy: { id: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Catálogo de Ataúdes</h2>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Agregar Nuevo Producto</h3>
        <form action={createCatalogo} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input required type="text" name="nombre" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Ej. Urna Madera" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input required type="text" name="material" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Ej. Roble" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base (CLP)</label>
            <input required type="number" name="precioBaseCLP" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="150000" />
          </div>
          <button type="submit" className="bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 h-10 font-medium">
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </form>
      </div>

      {/* Listado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {catalogos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No hay productos registrados en el catálogo.</td>
                </tr>
              )}
              {catalogos.map((item) => {
                const deleteAction = deleteCatalogo.bind(null, item.id);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.material}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.precioBaseCLP.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <form action={deleteAction} className="inline">
                        <button type="submit" className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Eliminar">
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
