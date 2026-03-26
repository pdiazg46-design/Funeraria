"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitServiceForm(formData: any) {
  try {
    // 1. Encuentra o crea el Usuario (basado en el correo del contacto)
    const emailToUse = (formData.contactoEmail || "contacto@sin-correo.cl").toLowerCase();
    
    let usuario = await prisma.usuario.findUnique({
      where: { email: emailToUse }
    });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          email: emailToUse,
          nombre: formData.contactoNombre,
          rol: "CLIENTE"
        }
      });
    }

    // 2. Crea el Servicio Funerario
    const servicio = await prisma.servicioFunerario.create({
      data: {
        clienteId: usuario.id,
        telefonoContacto: formData.contactoTel,
        nombreDifunto: formData.difuntoNombre,
        rutDifunto             : formData.difuntoRut || null,
        previsionLegal         : (formData.prevision || "NINGUNA") as "IPS" | "AFP" | "NINGUNA" | "DESCONOZCO",
        afpNombre              : formData.afp || null,
        
        docCedulaFrontal       : formData.docCedulaFrontal || null,
        docCedulaTrasera       : formData.docCedulaTrasera || null,
        docCertificadoDefuncion: formData.docCertificadoDefuncion || null,
        
        origenComunaId         : parseInt(formData.origen),
        origenCalle: formData.origenCalle,
        origenNumero: formData.origenNumero || "S/N",
        origenVilla: formData.origenVilla || null,

        destino1ComunaId: parseInt(formData.destino1),
        destino1Calle: formData.destino1Calle,
        destino1Numero: formData.destino1Numero || "S/N",
        destino1Villa: formData.destino1Villa || null,

        destino2ComunaId: formData.destino2 ? parseInt(formData.destino2) : null,
        destino2Calle: formData.destino2Calle || null,
        destino2Numero: formData.destino2Numero || null,
        destino2Villa: formData.destino2Villa || null,

        ataudId: formData.ataudSeleccionado || null,
        
        estado: "NUEVO_INGRESO",
        aplicarTarifaPlanaRM: 
          formData.origenRegion === '13' && 
          formData.destino1Region === '13' && 
          (!formData.destino2Region || formData.destino2Region === '13')
      }
    });

    // Calcular el costo inicial automáticamente si es RM
    if (servicio.aplicarTarifaPlanaRM) {
      const config = await prisma.configuracionGlobal.findFirst();
      const tarifaPlana = config?.tarifaPlanaRM_CLP || 50000;
      await prisma.servicioFunerario.update({
        where: { id: servicio.id },
        data: { costoTotalTrasladoCLP: tarifaPlana }
      });
    }

    // Forzar actualización del panel administrativo
    revalidatePath("/admin");
    revalidatePath("/admin/servicios");

    return { success: true, servicioId: servicio.id };
  } catch (error) {
    console.error("Error al guardar servicio:", error);
    return { success: false, error: "Error interno procesando la solicitud." };
  }
}
