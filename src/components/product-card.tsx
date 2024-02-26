import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { formatUSD } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
};

const ProductCard = ({ id, name, description, image, price }: ProductProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      void controls.start("show");
    }
  }, [controls, inView]);

  const item = {
    hidden: {
      opacity: 0,
      y: 50,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
  };

  return (
    <motion.li
      variants={item}
      initial="hidden"
      animate={controls}
      ref={ref}
      className="list-none"
    >
      <Link href={`/product/${id}`}>
        <Card className="text-start shadow-md transition duration-300 hover:shadow-lg">
          <CardHeader className="relative p-0">
            <Image
              src={image}
              width={400}
              height={400}
              alt="Product Image"
              className="aspect-square w-full rounded-t-[calc(theme(borderRadius.xl)-1px)] bg-center"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mb-2 text-xl font-semibold">{name}</CardTitle>
            <CardDescription className="mb-4 line-clamp-2">
              {description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="mb-2 text-popover-foreground">{formatUSD(price)}</p>
            <Button variant="secondary">Add to Cart</Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.li>
  );
};

export default ProductCard;
