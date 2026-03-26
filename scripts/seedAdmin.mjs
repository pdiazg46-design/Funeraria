import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@atsit.cl' },
    update: { 
      password: hash, 
      rol: 'SUPER_ADMIN' 
    },
    create: { 
      email: 'admin@atsit.cl', 
      password: hash, 
      nombre: 'AT-SIT Master', 
      rol: 'SUPER_ADMIN' 
    },
  });
  
  console.log('✅ Super Admin seed exitoso:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
