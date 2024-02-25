import Products from "@/components/products";
import Search from "@/components/search";
import { ProductCategories } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category: string;
  };
}) {
  const query = searchParams?.query || "";
  const category = (searchParams?.category || "").toUpperCase();
  if (category && !(category in ProductCategories)) return notFound();

  return (
    <div className="mx-auto mt-4 sm:w-3/4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl capitalize">
          {category ? category.toLowerCase() : "All Products"}
        </h2>
      </div>

      <Search
        placeholder="Search products..."
        className="mx-auto my-2 max-w-md md:my-4"
      />

      <Products
        query={query}
        category={(category as ProductCategories) ?? undefined}
      />
    </div>
  );
}
