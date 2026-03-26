"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProveedor(data: FormData) {
  const nombreEmpresa = data.get("nombreEmpresa") as string;
  const rutEmpresa = data.get("rutEmpresa") as string;
  const contacto = data.get("contacto") as string;
  const comunaBaseId = parseInt(data.get("comunaBaseId") as string);

  await prisma.proveedor.create({
    data: { nombreEmpresa, rutEmpresa, contacto, comunaBaseId }
  });

  revalidatePath("/admin/proveedores");
}

export async function deleteProveedor(id: string) {
  await prisma.proveedor.delete({ where: { id } });
  revalidatePath("/admin/proveedores");
}
