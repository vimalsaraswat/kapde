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

  getProducts: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        query: z.string().optional(),
        category: z.nativeEnum(ProductCategories).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor, query, category } = input;
      const items = await ctx.db.product.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          category: category ? category : undefined,

          ...(query
            ? {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          priceInCents: true,
          images: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),

  getProduct: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.product.findUnique({ where: { id: input } });
  }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({ where: { id: input } });
    }),
});
