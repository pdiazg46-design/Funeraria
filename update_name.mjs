import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.update({
    where: { email: 'pdiazg46@gmail.com' },
    data: { nombre: 'Patricio Díaz' }
  });
  console.log('OK');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
