import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ProductCategories } from "@prisma/client";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(25),
        description: z.string().min(10).max(225),
        priceInCents: z.number().positive(),
        quantity: z.number().positive(),
        images: z.array(z.string().url()).min(1).max(5),
        category: z.nativeEnum(ProductCategories),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          description: input.description,
          priceInCents: input.priceInCents,
          quantity: input.quantity,
          images: input.images,
          category: input.category,
        },
      });
    }),
});
