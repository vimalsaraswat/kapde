import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
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

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  category: publicProcedure
    .input(z.nativeEnum(ProductCategories))
    .query(({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { category: input },
        select: {
          id: true,
          name: true,
          description: true,
          priceInCents: true,
          images: true,
        },
      });
    }),

  getProduct: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.product.findUnique({ where: { id: input } });
  }),
});
