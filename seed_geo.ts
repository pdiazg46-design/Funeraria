import { prisma } from './src/lib/prisma';
import { regionesChile, comunasChile } from './src/data/geografia';

async function main() {
  for (const r of regionesChile) {
    await prisma.region.upsert({
      where: { id: parseInt(r.id) },
      update: { nombre: r.nombre },
      create: { id: parseInt(r.id), nombre: r.nombre }
    });
  }

  for (const c of comunasChile) {
    await prisma.comuna.upsert({
      where: { id: parseInt(c.id) },
      update: { nombre: c.nombre, regionId: parseInt(c.regionId) },
      create: { id: parseInt(c.id), nombre: c.nombre, regionId: parseInt(c.regionId) }
    });
  }
  console.log('SEEDED');
}
main().finally(() => prisma.$disconnect());
