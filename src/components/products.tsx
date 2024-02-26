"use client";

import { api } from "@/trpc/react";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ProductCategories } from "@prisma/client";
import ProductCard from "./product-card";

type ProductType = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  images: string[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const Products = ({
  category,
  query,
}: {
  category?: ProductCategories;
  query?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  const {
    data,
    fetchNextPage,
    error,
    isLoading,
    hasNextPage,
    isSuccess,
    isFetchingNextPage,
  } = api.product.getProducts.useInfiniteQuery(
    {
      limit: 12,
      query: query ?? undefined,
      category: category ?? undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (error)
    return (
      <div className="mt-10">{"An error has occurred: " + error.message}</div>
    );

  return (
    <section>
      {isSuccess && (
        <motion.ul
          initial="hidden"
          animate="show"
          variants={container}
          className="3xl:grid-cols-4 mx-2 mt-10 grid gap-2 text-center sm:grid-cols-2 md:gap-4 lg:mb-0 lg:w-full lg:grid-cols-3"
        >
          {isSuccess &&
            data?.pages.map((page) =>
              page.items.map((product: ProductType, index: number) => {
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.priceInCents * 100}
                    image={product.images[0]!}
                  />
                );
              }),
            )}
        </motion.ul>
      )}
      <div ref={ref}></div>
      <p className="my-4 text-center">
        {isLoading || isFetchingNextPage
          ? "Loading..."
          : "Sorry, no more items at the moment!"}
      </p>
    </section>
  );
};

export default Products;
