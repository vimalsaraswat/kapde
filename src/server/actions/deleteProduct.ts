"use server";

import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteProduct(id: string) {
  try {
    await api.product.deleteById.mutate(id);
  } catch (error) {
    return {
      message: "Database Error: Failed to delete Product.",
    };
  }
  // Revalidate the cache and redirect the user.
  revalidatePath("/products");
  redirect("/products");
}
