import { prisma } from "@/lib/prisma";
import { asignarProveedor, actualizarCostos, actualizarCostoOperador } from "../actions";
import { ArrowLeft, MapPin, Truck, DollarSign, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import TarifaPlanaForm from "@/components/admin/TarifaPlanaForm";
import CostoOperadorForm from "@/components/admin/CostoOperadorForm";

export const dynamic = 'force-dynamic';

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

  const config = await prisma.configuracionGlobal.findFirst();
  const tarifaPlanaRM = config?.tarifaPlanaRM_CLP || 50000;

  if (!servicio) return notFound();

  const proveedores = await prisma.proveedor.findMany({ orderBy: { nombreEmpresa: 'asc' } });
  const assignAction = asignarProveedor.bind(null, id);
  const costAction = actualizarCostos.bind(null, id);
  const costoOpAction = actualizarCostoOperador.bind(null, id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <Link href="/admin/servicios" className="text-slate-500 hover:text-amber-400 transition-colors p-2 hover:bg-slate-800 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-3xl font-serif text-white tracking-wide">Detalle de Operación</h2>
        <span className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest ml-auto border
          ${servicio.estado === 'NUEVO_INGRESO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 
          servicio.estado === 'EN_CURSO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
          servicio.estado === 'FINALIZADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
          'bg-slate-800 text-slate-400 border-slate-700'}`}>
          {servicio.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300">
        {/* Info Cliente & Difunto */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          <h3 className="text-lg font-serif mb-5 text-amber-500 flex items-center gap-2"><User className="w-5 h-5"/> Información General</h3>
          <div className="space-y-4 text-sm">
            <p><span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Cliente Solicitante</span> <span className="text-slate-200 text-base">{servicio.cliente?.nombre || servicio.cliente?.email}</span></p>
            <p><span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Teléfono Contacto</span> <span className="text-slate-200 text-base">{servicio.telefonoContacto}</span></p>
            <hr className="my-4 border-slate-800" />
            <p><span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Nombre Fallecido</span> <span className="text-slate-200 text-base uppercase tracking-wide">{servicio.nombreDifunto}</span></p>
            <p><span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">RUT</span> <span className="text-amber-500 font-mono text-base">{servicio.rutDifunto || "No indicado"}</span></p>
            <p><span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Previsión Institucional</span> <span className="text-slate-200 text-base uppercase tracking-wider">{servicio.previsionLegal} {servicio.afpNombre ? `(${servicio.afpNombre})` : ''}</span></p>
            {servicio.ataud && (
              <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Urna Contratada</span> 
                  <span className="text-amber-400 font-bold uppercase tracking-wider lg:text-lg block">{servicio.ataud.nombre}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1 block">Material: {servicio.ataud.material}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Valor Plataforma</span>
                  <span className="text-emerald-400 font-bold tracking-wider text-xl">${servicio.ataud.precioBaseCLP.toLocaleString('es-CL')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Ruta */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          <h3 className="text-lg font-serif mb-5 text-amber-500 flex items-center gap-2"><MapPin className="w-5 h-5"/> Ruta Logística</h3>
          <div className="space-y-6 text-sm relative border-l-2 border-slate-800 ml-2 pl-6">
            <div className="relative">
              <div className="absolute w-4 h-4 bg-slate-900 border-2 border-slate-600 rounded-full -left-[33px] top-1"></div>
              <p className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-1">Origen (Fallecimiento)</p>
              <p className="text-slate-200 uppercase tracking-wide">{servicio.origen?.nombre}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{servicio.origenCalle} {servicio.origenNumero}, {servicio.origenVilla || ""}</p>
            </div>
            <div className="relative">
              <div className="absolute w-4 h-4 bg-slate-900 border-2 border-amber-500/50 rounded-full -left-[33px] top-1"></div>
              <p className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-1">Destino 1 (Velatorio)</p>
              <p className="text-slate-200 uppercase tracking-wide">{servicio.destino1?.nombre}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{servicio.destino1Calle} {servicio.destino1Numero}</p>
            </div>
            {servicio.destino2 && (
              <div className="relative">
                <div className="absolute w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] -left-[33px] top-1"></div>
                <p className="font-bold text-[10px] uppercase tracking-widest text-amber-500 mb-1">Destino 2 (Cementerio/Crematorio)</p>
                <p className="text-white font-bold uppercase tracking-wide">{servicio.destino2?.nombre}</p>
                <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider">{servicio.destino2Calle} {servicio.destino2Numero}</p>
              </div>
            )}
          </div>
        </div>

        {/* Motor de Cotización (Costos) */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          <h3 className="text-lg font-serif mb-5 text-amber-500 flex items-center gap-2"><DollarSign className="w-5 h-5"/> Costos Logísticos</h3>
          <form action={costAction} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-1">Distancia Base (IA)</p>
                <p className="text-xl font-bold text-slate-200">{servicio.kmCalculadosAlgoritmo} <span className="text-xs text-slate-500">km</span></p>
              </div>
              <div>
                <p className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-1">Tarifa Plana RM / Global</p>
                <div className="mt-1">
                  {servicio.aplicarTarifaPlanaRM ? (
                    <TarifaPlanaForm defaultTarifa={tarifaPlanaRM} servicioId={id} />
                  ) : (
                    <span className="text-sm font-bold text-slate-500 block mt-2">No aplica</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Ajuste Manual: Km Adicionales / Rurales</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" name="kmAdicionalRural" defaultValue={servicio.kmAdicionalRural} onFocus={e => e.target.select()} className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-mono focus:outline-none transition-colors" />
                <button type="submit" className="bg-slate-800 text-slate-300 px-6 rounded-xl hover:bg-slate-700 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest border border-slate-700">Calcular</button>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-800 flex flex-col justify-end">
              <p className="font-bold text-[10px] uppercase tracking-widest text-amber-500 mb-1">Costo Total Traslado</p>
              <p className="text-4xl font-bold text-white tracking-wider">${servicio.costoTotalTrasladoCLP.toLocaleString('es-CL')}</p>
            </div>
            
            {(servicio.ataud) && (
              <div className="pt-6 mt-6 border-t-2 border-slate-800/80">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.05)]">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Voucher de Cobro Final
                  </h4>
                  
                  <div className="space-y-3 mb-4 text-sm font-mono text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>Valor Comercial Urna</span>
                      <span className="font-bold">${servicio.ataud.precioBaseCLP.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                      <span>Costo Total Logística</span>
                      <span className="font-bold">${servicio.costoTotalTrasladoCLP.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Tarifa Total Servicio</span>
                      <span className="text-3xl font-bold text-emerald-400 tracking-wider">
                        ${(servicio.ataud.precioBaseCLP + servicio.costoTotalTrasladoCLP).toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Columna Derecha / Inferior: Asignación y Pagos a Proveedor */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-fit">
          <h3 className="text-lg font-serif mb-5 text-amber-500 flex items-center gap-2"><Truck className="w-5 h-5"/> Asignar Proveedor Operativo</h3>
          <form action={assignAction} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Operador / Funeraria Asociada</label>
              <select key={servicio.proveedorId || "unassigned"} name="proveedorId" defaultValue={servicio.proveedorId || ""} className="w-full border-slate-700 rounded-xl shadow-sm p-3 bg-slate-950 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white focus:outline-none transition-colors uppercase tracking-wide text-sm">
                <option value="">-- NO ASIGNADO --</option>
                {proveedores.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombreEmpresa} (RUT: {p.rutEmpresa})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-amber-500 text-slate-950 py-3 rounded-xl hover:bg-amber-400 transition-colors font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              Guardar Asignación &rarr;
            </button>
          </form>
        </div>

        {servicio.proveedorId && (
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-fit">
            <h3 className="text-lg font-serif mb-5 text-emerald-400 flex items-center gap-2"><DollarSign className="w-5 h-5"/> Costo a Pagar a Operador</h3>
            <div className="space-y-4">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Monto Acordado con <strong className="text-emerald-400 block mt-1 text-sm">{servicio.proveedor?.nombreEmpresa}</strong>
              </label>
              <p className="text-[10px] text-slate-400 italic mb-2">Este valor es de uso interno para finanzas.</p>
              
              <CostoOperadorForm defaultTarifa={servicio.costoOperadorCLP || 0} servicioId={id} />
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
