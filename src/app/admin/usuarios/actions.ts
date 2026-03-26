"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createUsuario(data: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).rol !== "SUPER_ADMIN") {
    throw new Error("No tienes permisos para crear usuarios.");
  }

  const email = data.get("email") as string;
  const nombre = data.get("nombre") as string;
  const passwordText = data.get("password") as string;
  const rol = data.get("rol") as "ADMINISTRADOR" | "PROVEEDOR" | "SUPER_ADMIN";

  const hash = await bcrypt.hash(passwordText, 10);

  await prisma.usuario.create({
    data: {
      email: email.toLowerCase(),
      nombre,
      password: hash,
      rol
    }
  });

  revalidatePath("/admin/usuarios");
}

export async function deleteUsuario(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).rol !== "SUPER_ADMIN") {
    throw new Error("No tienes permisos.");
  }

  await prisma.usuario.delete({
    where: { id }
  });

  revalidatePath("/admin/usuarios");
}
