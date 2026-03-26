import { prisma } from "@/lib/prisma";
import { createProveedor, deleteProveedor } from "./actions";
import { Plus, Trash2 } from "lucide-react";

export default async function ProveedoresPage() {
  const proveedores = await prisma.proveedor.findMany({
    orderBy: { nombreEmpresa: "asc" }
  });

  const comunas = await prisma.comuna.findMany({ orderBy: { nombre: 'asc'} });
  const comunasMap = new Map(comunas.map((c: any) => [c.id, c.nombre]));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h2>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Registrar Nuevo Proveedor</h3>
        <form action={createProveedor} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <input required type="text" name="nombreEmpresa" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Ej. Funeraria Hogar" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT Empresa</label>
            <input required type="text" name="rutEmpresa" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="76.000.000-0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
            <input required type="text" name="contacto" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="+56 9..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comuna Base</label>
            <select required name="comunaBaseId" className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none">
              <option value="">Selecciona Comuna</option>
              {comunas.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 h-10 font-medium w-full">
            <Plus className="w-4 h-4" /> Registrar
          </button>
        </form>
      </div>

      {/* Listado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comuna Base</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proveedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No hay proveedores registrados.</td>
                </tr>
              )}
              {proveedores.map((item: any) => {
                const deleteAction = deleteProveedor.bind(null, item.id);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombreEmpresa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rutEmpresa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contacto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(comunasMap.get(item.comunaBaseId) || `ID ${item.comunaBaseId}`)}
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
