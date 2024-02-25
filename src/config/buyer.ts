import { ProductCategories } from "@prisma/client";

const categories = Object.keys(ProductCategories).map((category) => {
  return {
    title: category,
    href: `/?category=${category.toLowerCase()}`,
  };
});

const BuyerConfig = {
  nav: [
    ...categories,
    {
      title: "ALL",
      href: "/",
    },
  ],
};

export default BuyerConfig;
