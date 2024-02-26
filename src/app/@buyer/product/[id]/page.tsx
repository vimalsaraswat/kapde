import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { formatUSD } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await api.product.getProduct.query(params.id);

  if (!product) return notFound();

  return (
    <div className="mx-4 mt-4 sm:mx-auto sm:w-5/6 lg:w-3/4">
      <div className="mx-auto flex h-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:max-w-5xl">
          <ProductPreview images={product?.images} />
        </div>
        <div className="space-y-4 lg:w-3/5">
          <h2 className="text-2xl font-bold md:text-4xl">{product.name}</h2>
          <p>{product.description}</p>
          <Badge variant="secondary">Category: {product.category}</Badge>
          <div className="flex justify-between">
            <p className="text-popover-foreground">
              {formatUSD(product.priceInCents)}
            </p>
            <Button variant="secondary">Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview({ images }: { images: string[] }) {
  return (
    <Carousel className="mx-4 sm:mx-auto sm:w-4/5">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              src={image}
              alt="Product Preview Image"
              className="aspect-square h-full w-full rounded-sm"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:inline-flex" />
      <CarouselNext className="hidden sm:inline-flex" />
    </Carousel>
  );
}
