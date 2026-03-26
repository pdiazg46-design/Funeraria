import { prisma } from './src/lib/prisma';

async function main() {
  const c = await prisma.comuna.count();
  console.log("Comunas en DB:", c);
  
  if (c > 0) {
    const firstComunas = await prisma.comuna.findMany({ take: 5 });
    console.log(firstComunas);
  } else {
    console.log("LA TABLA COMUNA ESTA VACIA!");
  }
}
main().finally(() => prisma.$disconnect());
