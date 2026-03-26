"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCatalogo(data: FormData) {
  const nombre = data.get("nombre") as string;
  const material = data.get("material") as string;
  const precioBaseCLPText = data.get("precioBaseCLP") as string;
  const precioBaseCLP = parseFloat(precioBaseCLPText.replace(/\./g, ''));
  const imagenUrl = data.get("imagenUrl") as string || null;
  const descripcion = data.get("descripcion") as string || null;

  await prisma.catalogoAtaudes.create({
    data: { nombre, material, precioBaseCLP, imagenUrl, descripcion }
  });

  revalidatePath("/admin/catalogo");
}

export async function deleteCatalogo(id: number) {
  await prisma.catalogoAtaudes.delete({ where: { id } });
  revalidatePath("/admin/catalogo");
}

export async function updateCatalogo(id: number, data: FormData) {
  const nombre = data.get("nombre") as string;
  const material = data.get("material") as string;
  const precioBaseCLPText = data.get("precioBaseCLP") as string;
  const precioBaseCLP = parseFloat(precioBaseCLPText.replace(/\./g, ''));
  const imagenUrl = data.get("imagenUrl") as string || null;
  const descripcion = data.get("descripcion") as string || null;

  await prisma.catalogoAtaudes.update({
    where: { id },
    data: { nombre, material, precioBaseCLP, imagenUrl, descripcion }
  });

  revalidatePath("/admin/catalogo");
}
