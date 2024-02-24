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

type ProductProps = {
  name: string;
  description: string;
  image: string;
  price: number;
};

const ProductCard = ({ name, description, image, price }: ProductProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start("show");
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
      <Card className=" ounded-lg text-start shadow-md transition duration-300 hover:shadow-lg">
        <CardHeader className="relative p-0">
          <Image
            src={image}
            width={400}
            height={400}
            alt="Product Image"
            className="aspect-square w-full bg-center"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="mb-2 text-xl font-semibold">{name}</CardTitle>
          <CardDescription className="mb-4 line-clamp-3">
            {description}
          </CardDescription>
          <p className="mb-2 text-popover-foreground">{formatUSD(price)}</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Add to Cart</Button>
        </CardFooter>
      </Card>
    </motion.li>
  );
};

export default ProductCard;
