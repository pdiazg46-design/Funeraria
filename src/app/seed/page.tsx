import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export default async function SeedPage() {
  const hash = await bcrypt.hash('admin123', 10);
  
  await prisma.usuario.upsert({
    where: { email: 'admin@atsit.cl' },
    update: { password: hash, rol: 'SUPER_ADMIN' },
    create: { email: 'admin@atsit.cl', password: hash, nombre: 'AT-SIT Maestro', rol: 'SUPER_ADMIN' },
  });
  
  return (
    <div style={{ background: "transparent", color: "white", padding: "2rem" }}>
      <h2>✅ Semilla inyectada en DB Exitosa</h2>
      <p>Usuario: admin@atsit.cl</p>
      <p>Clave: admin123</p>
    </div>
  );
}
