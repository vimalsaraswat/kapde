import { ProductsTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";

async function Products() {
  const products = await api.product.getAll.query();
  return (
    <div className="mx-auto w-4/5">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Products</h1>
      </div>
      <Button variant="secondary">
        <Link href="/products/new" className="flex">
          <span className="hidden md:block">Add Product</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </Button>

      <Suspense key={2} fallback={<>Loading</>}>
        <ProductsTable products={products} />
      </Suspense>
    </div>
  );
}

export default Products;
