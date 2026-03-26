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
  const costoTotal = (servicio.kmCalculadosAlgoritmo + kmAdicionalRural) * VALOR_POR_KM;

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
