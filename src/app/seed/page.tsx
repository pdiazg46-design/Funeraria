import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export default async function SeedPage() {
  const hash = await bcrypt.hash('pdiaz123', 10);
  
  await prisma.usuario.upsert({
    where: { email: 'pdiazg46@gmail.com' },
    update: { password: hash, rol: 'SUPER_ADMIN', nombre: 'Patricio Díaz' },
    create: { email: 'pdiazg46@gmail.com', password: hash, nombre: 'Patricio Díaz', rol: 'SUPER_ADMIN' },
  });
  
  return (
    <div style={{ background: "transparent", color: "white", padding: "2rem" }}>
      <h2>✅ Semilla inyectada en DB Exitosa</h2>
      <p>Usuario: pdiazg46@gmail.com</p>
      <p>Clave: pdiaz123</p>
    </div>
  );
}
