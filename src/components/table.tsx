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

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <Table className="mt-6">
      <TableCaption>A list of your recent products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="hidden sm:block">Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="max-w-[100px] truncate font-medium">
              {product.name}
            </TableCell>
            <TableCell className="hidden max-w-lg truncate sm:block">
              {product.description}
            </TableCell>
            <TableCell className="text-right">
              {formatter.format(product.priceInCents / 100)}
            </TableCell>
            <TableCell className="text-center">{product.quantity}</TableCell>
            <TableCell>{product.category}</TableCell>
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
