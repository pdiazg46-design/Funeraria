import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Limpiando base de datos...");
  // Desactivamos temporalmente consistencia estricta para borrar todo si es Postgres
  // Pero Prisma usa find/delete. Borraremos en orden para no fallar FKs
  await prisma.servicioFunerario.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.catalogoAtaudes.deleteMany();
  await prisma.matrizDistancia.deleteMany();
  await prisma.comuna.deleteMany();
  await prisma.region.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Creando Regiones...");
  const rm = await prisma.region.create({ data: { id: 13, nombre: 'Región Metropolitana' } });
  const valpo = await prisma.region.create({ data: { id: 5, nombre: 'Región de Valparaíso' } });

  console.log("Creando Comunas...");
  const santiago = await prisma.comuna.create({ data: { nombre: 'Santiago', regionId: rm.id } });
  const providencia = await prisma.comuna.create({ data: { nombre: 'Providencia', regionId: rm.id } });
  const vitacura = await prisma.comuna.create({ data: { nombre: 'Vitacura', regionId: rm.id } });
  const vina = await prisma.comuna.create({ data: { nombre: 'Viña del Mar', regionId: valpo.id } });
  const valparaiso = await prisma.comuna.create({ data: { nombre: 'Valparaíso', regionId: valpo.id } });

  console.log("Creando Catálogo...");
  const ataud1 = await prisma.catalogoAtaudes.create({ data: { nombre: 'Urna Clásica', material: 'Pino', precioBaseCLP: 180000 } });
  const ataud2 = await prisma.catalogoAtaudes.create({ data: { nombre: 'Urna Premium', material: 'Roble', precioBaseCLP: 450000 } });
  const ataud3 = await prisma.catalogoAtaudes.create({ data: { nombre: 'Urna Párvulo', material: 'Pino Blanco', precioBaseCLP: 120000 } });

  console.log("Creando Proveedores...");
  const prov1 = await prisma.proveedor.create({ data: { nombreEmpresa: 'Funeraria El Descanso', rutEmpresa: '76.123.456-7', contacto: '+56 9 1234 5678', comunaBaseId: santiago.id } });
  const prov2 = await prisma.proveedor.create({ data: { nombreEmpresa: 'Traslados Rápidos V Región', rutEmpresa: '77.987.654-3', contacto: '+56 9 8765 4321', comunaBaseId: vina.id } });

  console.log("Creando Cliente...");
  const cliente = await prisma.usuario.create({ data: { email: 'cliente@test.com', nombre: 'Juan Pérez', rol: "CLIENTE" } });

  console.log("Creando Servicio de Prueba 1: Tarifa Plana RM...");
  await prisma.servicioFunerario.create({
    data: {
      estado: "NUEVO_INGRESO",
      clienteId: cliente.id,
      telefonoContacto: '+56 9 1111 2222',
      nombreDifunto: 'María González',
      rutDifunto: '5.555.555-5',
      previsionLegal: "NINGUNA",
      origenComunaId: santiago.id,
      origenCalle: 'Alameda',
      origenNumero: '123',
      destino1ComunaId: providencia.id,
      destino1Calle: 'Av. Providencia',
      destino1Numero: '1000',
      ataudId: ataud1.id,
      aplicarTarifaPlanaRM: true,
      kmCalculadosAlgoritmo: 0,
      costoTotalTrasladoCLP: 150000
    }
  });

  console.log("Creando Servicio de Prueba 2: Interregional...");
  await prisma.servicioFunerario.create({
    data: {
      estado: "ASIGNANDO_PROVEEDOR",
      clienteId: cliente.id,
      telefonoContacto: '+56 9 9999 8888',
      nombreDifunto: 'Carlos Soto',
      previsionLegal: "IPS",
      origenComunaId: santiago.id,
      origenCalle: 'Arturo Prat',
      origenNumero: '456',
      destino1ComunaId: vina.id,
      destino1Calle: 'Avenida Libertad',
      destino1Numero: '789',
      destino2ComunaId: valparaiso.id,
      destino2Calle: 'Cerro Alegre',
      destino2Numero: '12',
      ataudId: ataud2.id,
      aplicarTarifaPlanaRM: false,
      kmCalculadosAlgoritmo: 120, // Simulando Dijkstra
      kmAdicionalRural: 5,
      costoTotalTrasladoCLP: 125000, 
      proveedorId: prov2.id // Ya asignado
    }
  });

  console.log("¡Seed de pruebas funcionales completado con éxito!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
