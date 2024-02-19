"use server";

import { ProductCategories, type Product } from "@prisma/client";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(ProductCategories),
  price: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  quantity: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  images: z.array(z.string().url()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const NewProduct = FormSchema.omit({
  id: true,
  images: true,
  createdAt: true,
  updatedAt: true,
});

export async function createProduct(formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = NewProduct.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    category: formData.get("category"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to add product.",
    };
  }

  const images = formData.getAll("images") as Array<File>;
  if (!(images.length > 0 && images.length < 5))
    return { message: "Atlest 1 and atmost 5 product images are required" };

  // Upload images to cloudinary and saving the public urls
  const imgUrls: string[] = [];
  for (const image of images) {
    const arrayBuffer = await image.arrayBuffer();
    const result = await uploadImageBuffer(arrayBuffer);
    if (result) imgUrls.push(result.secure_url);
  }

  // Prepare data for insertion into the database
  const { name, description, price, quantity, category } = validatedFields.data;
  const priceInCents = price * 100;

  try {
    // Insert data into the database
    await api.product.create.mutate({
      name,
      description,
      priceInCents,
      quantity,
      category,
      images: imgUrls,
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }
  // Revalidate the cache and redirect the user.
  revalidatePath("/products");
  redirect("/products");
}
