"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function asignarProveedor(servicioId: string, formData: FormData) {
  const proveedorId = formData.get("proveedorId") as string;
  await prisma.servicioFunerario.update({
    where: { id: servicioId },
    data: { 
      proveedorId: proveedorId || null,
      estado: proveedorId ? "ASIGNANDO_PROVEEDOR" : "NUEVO_INGRESO"
    }
  });
  revalidatePath(`/admin/servicios/${servicioId}`);
  revalidatePath("/admin/servicios");
}

export async function actualizarCostos(servicioId: string, formData: FormData) {
  const kmAdicionalRural = parseFloat(formData.get("kmAdicionalRural") as string);
  
  const servicio = await prisma.servicioFunerario.findUnique({ where: { id: servicioId } });
  if (!servicio) return;

  const VALOR_POR_KM = 1000; // Asumido provisoriamente
  let costoTotal = 0;

  if (servicio.aplicarTarifaPlanaRM) {
    const config = await prisma.configuracionGlobal.findFirst();
    const tarifaPlana = config?.tarifaPlanaRM_CLP || 50000;
    costoTotal = tarifaPlana + (kmAdicionalRural * VALOR_POR_KM);
  } else {
    costoTotal = (servicio.kmCalculadosAlgoritmo + kmAdicionalRural) * VALOR_POR_KM;
  }

  await prisma.servicioFunerario.update({
    where: { id: servicioId },
    data: { 
      kmAdicionalRural,
      costoTotalTrasladoCLP: costoTotal
    }
  });

  revalidatePath(`/admin/servicios/${servicioId}`);
  revalidatePath("/admin/servicios");
}

export async function actualizarTarifaPlanaGlobal(servicioId: string, formData: FormData) {
  const nuevaTarifa = parseFloat(formData.get("tarifaPlanaRM_CLP") as string);
  if (!nuevaTarifa) return;

  let config = await prisma.configuracionGlobal.findFirst();
  if (config) {
    await prisma.configuracionGlobal.update({
      where: { id: config.id },
      data: { tarifaPlanaRM_CLP: nuevaTarifa }
    });
  } else {
    await prisma.configuracionGlobal.create({
      data: { tarifaPlanaRM_CLP: nuevaTarifa }
    });
  }

  // Refrescar todos los servicios para que recálculos de UI reflejen el nuevo precio global
  revalidatePath("/admin/servicios");
  revalidatePath(`/admin/servicios/${servicioId}`);
  revalidatePath(`/admin/servicios/[id]`, 'page');
}
