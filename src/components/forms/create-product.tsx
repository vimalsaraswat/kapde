"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ImageDropzone from "@/components/image-dropzone";
import { ProductCategories } from "@prisma/client";
import { createProduct } from "@/server/actions/createProduct";
import { useState } from "react";
import { ButtonLoading } from "../button-loading";

const Categories = Object.values(ProductCategories);
const MAX_FILE_SIZE = 1024 * 1024 * 1; // 1MB
const MAX_FILES = 5;
const imageMimeTypes = [
  "image/webp",
  "image/tiff",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/vnd.microsoft.icon",
  "image/gif",
  "image/bmp",
];

const image = z
  .custom<File>()
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size should be less than 1mb.`,
  )
  .refine(
    (file) => imageMimeTypes.includes(file.type),
    "Only these types are allowed .jpg, .jpeg, .png, .svg, .gif and .webp",
  );

const FormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(225),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  category: z.nativeEnum(ProductCategories),
  images: z.array(image).min(1).max(5),
});

export default function CreateProduct() {
  const [Loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", String(data.price));
    formData.append("quantity", String(data.quantity));
    for (const imageFile of data.images) {
      formData.append("images", imageFile);
    }

    createProduct(formData)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto block space-y-6 sm:flex sm:gap-2"
      >
        <div className="sm:flex-1">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      maxFiles={MAX_FILES}
                      maxSize={MAX_FILE_SIZE}
                      handleImages={field.onChange}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="sm:flex-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Product's display name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about your product"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      placeholder="Product's price per item in dollars"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product's available quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an appropriate category for the product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Categories.map((category) => (
                      <SelectItem value={category} key={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton loading={Loading} />
        </div>
      </form>
    </Form>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <div className="mt-4">
      {loading ? <ButtonLoading /> : <Button type="submit">Add Product</Button>}
    </div>
  );
}
