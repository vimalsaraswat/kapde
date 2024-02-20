import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import deleteProduct from "@/server/actions/deleteProduct";

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <Table className="mt-6">
      <TableCaption>A list of your recent products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[250px]">Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="max-w-[100px] truncate font-medium">
              {product.name}
            </TableCell>
            <TableCell className="truncate">{product.description}</TableCell>
            <TableCell className="text-right">
              {formatter.format(product.priceInCents / 100)}
            </TableCell>
            <TableCell className="text-center">{product.quantity}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="flex justify-center gap-2">
              <DeleteButton id={product.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function DeleteButton({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteProduct.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <Button variant="destructive" size="icon">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </form>
  );
}
