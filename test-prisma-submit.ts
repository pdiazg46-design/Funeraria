import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const formData = {
      contactoEmail: "test@test.com",
      contactoNombre: "TESTER",
      contactoTel: "+56 9 1234 5678",
      difuntoNombre: "TEST NAME",
      difuntoRut: "11111111-1",
      prevision: "DESCONOZCO",
      afp: null,
      docCedulaFrontal: "BASE64...",
      docCedulaTrasera: "BASE64...",
      docCertificadoDefuncion: "BASE64...",
      origen: "13101",
      origenCalle: "TEST O",
      origenNumero: "1",
      origenVilla: null,
      destino1: "13123",
      destino1Calle: "TEST D",
      destino1Numero: "2",
      destino1Villa: null,
      destino2: null,
      destino2Calle: null,
      destino2Numero: null,
      destino2Villa: null,
      ataudSeleccionado: 1
    };

    let usuario = await prisma.usuario.findUnique({
      where: { email: formData.contactoEmail }
    });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          email: formData.contactoEmail,
          nombre: formData.contactoNombre,
          rol: "CLIENTE"
        }
      });
    }

    const servicio = await prisma.servicioFunerario.create({
      data: {
        clienteId: usuario.id,
        telefonoContacto: formData.contactoTel,
        nombreDifunto: formData.difuntoNombre,
        rutDifunto: formData.difuntoRut || null,
        previsionLegal: (formData.prevision || "NINGUNA") as any, // "DESCONOZCO" is in the new schema
        afpNombre: formData.afp || null,
        docCedulaFrontal: formData.docCedulaFrontal || null,
        docCedulaTrasera: formData.docCedulaTrasera || null,
        docCertificadoDefuncion: formData.docCertificadoDefuncion || null,
        origenComunaId: parseInt(formData.origen),
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
        estado: "NUEVO_INGRESO"
      }
    });
    console.log("SUCCESS:", servicio.id);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
