import CreateProduct from "@/components/forms/create-product";
import Breadcrumbs from "@/components/breadcrumbs";

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/products" },
          {
            label: "New Product",
            href: "/products/new",
            active: true,
          },
        ]}
      />
      <CreateProduct />
    </>
  );
}
