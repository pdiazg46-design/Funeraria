import { prisma } from "@/lib/prisma";
import { asignarProveedor, actualizarCostos } from "../actions";
import { ArrowLeft, MapPin, Truck, DollarSign, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const servicio = await prisma.servicioFunerario.findUnique({
    where: { id },
    include: {
      cliente: true,
      proveedor: true,
      origen: true,
      destino1: true,
      destino2: true,
      ataud: true,
    }
  });

  if (!servicio) return notFound();

  const proveedores = await prisma.proveedor.findMany({ orderBy: { nombreEmpresa: 'asc' } });
  const assignAction = asignarProveedor.bind(null, id);
  const costAction = actualizarCostos.bind(null, id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/servicios" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Detalle de Servicio</h2>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ml-auto">
          {servicio.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Cliente & Difunto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center gap-2"><User className="w-5 h-5"/> Información General</h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold text-gray-600">Cliente:</span> {servicio.cliente?.nombre || servicio.cliente?.email}</p>
            <p><span className="font-semibold text-gray-600">Teléfono:</span> {servicio.telefonoContacto}</p>
            <hr className="my-2 border-gray-100" />
            <p><span className="font-semibold text-gray-600">Fallecido:</span> {servicio.nombreDifunto}</p>
            <p><span className="font-semibold text-gray-600">RUT:</span> {servicio.rutDifunto || "No indicado"}</p>
            <p><span className="font-semibold text-gray-600">Previsión:</span> {servicio.previsionLegal} {servicio.afpNombre ? `(${servicio.afpNombre})` : ''}</p>
            {servicio.ataud && (
              <p><span className="font-semibold text-gray-600">Ataúd Seleccionado:</span> {servicio.ataud.nombre}</p>
            )}
          </div>
        </div>

        {/* Info Ruta */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5"/> Ruta Logística</h3>
          <div className="space-y-4 text-sm relative border-l-2 border-gray-200 ml-2 pl-4">
            <div>
              <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-[7px] top-1"></div>
              <p className="font-semibold text-gray-800">Origen (Fallecimiento)</p>
              <p className="text-gray-600">{servicio.origen?.nombre}</p>
              <p className="text-xs text-gray-500">{servicio.origenCalle} {servicio.origenNumero}, {servicio.origenVilla || ""}</p>
            </div>
            <div>
              <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-[7px] top-[45%]"></div>
              <p className="font-semibold text-gray-800">Destino 1 (Velatorio)</p>
              <p className="text-gray-600">{servicio.destino1?.nombre}</p>
              <p className="text-xs text-gray-500">{servicio.destino1Calle} {servicio.destino1Numero}</p>
            </div>
            {servicio.destino2 && (
              <div>
                <div className="absolute w-3 h-3 bg-gray-900 rounded-full -left-[7px] bottom-1"></div>
                <p className="font-semibold text-gray-800">Destino 2 (Cementerio/Crematorio)</p>
                <p className="text-gray-600">{servicio.destino2?.nombre}</p>
                <p className="text-xs text-gray-500">{servicio.destino2Calle} {servicio.destino2Numero}</p>
              </div>
            )}
          </div>
        </div>

        {/* Motor de Cotización (Costos) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center gap-2"><DollarSign className="w-5 h-5"/> Costos de Traslado</h3>
          <form action={costAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Distancia Base (Algoritmo)</p>
                <p className="text-lg font-medium">{servicio.kmCalculadosAlgoritmo} km</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Tarifa Plana RM</p>
                <p className="text-lg font-medium">{servicio.aplicarTarifaPlanaRM ? "Aplicada" : "No"}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Km Adicionales / Rurales</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" name="kmAdicionalRural" defaultValue={servicio.kmAdicionalRural} className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                <button type="submit" className="bg-gray-800 text-white px-4 rounded-md hover:bg-gray-700 text-sm font-medium">Actualizar</button>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-600">Costo Total Traslado</p>
              <p className="text-3xl font-bold text-gray-900">${servicio.costoTotalTrasladoCLP.toLocaleString('es-CL')}</p>
            </div>
          </form>
        </div>

        {/* Asignación de Proveedor */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center gap-2"><Truck className="w-5 h-5"/> Asignar Proveedor Operativo</h3>
          <form action={assignAction} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Operador / Funeraria</label>
              <select name="proveedorId" defaultValue={servicio.proveedorId || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 border focus:ring-2 focus:ring-gray-900 focus:outline-none">
                <option value="">-- Sin Asignar --</option>
                {proveedores.map(p => (
                  <option key={p.id} value={p.id}>{p.nombreEmpresa} (RUT: {p.rutEmpresa})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
              Guardar Asignación
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
