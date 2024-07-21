import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";

export const chatRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        content: z.string(),
        senderUsername: z.string(),
        receiverUsername: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.db.message.create({
        data: {
          content: input.content,
          senderUsername: ctx.session?.user.username,
          receiverUsername: input.receiverUsername,
        },
      });
      return message;
    }),
  getMessages: publicProcedure.query(async () => {
    const messages = await db.message.findMany({
      where: {
        createdAt: {
          gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        sender: true,
      },
    });
    return messages;
  }),
  getUserMessage: protectedProcedure
    .input(
      z.object({
        receiverUsername: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const messages = await db.message.findMany({
        where: {
          createdAt: {
            gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          OR: [
            {
              senderUsername: ctx.session?.user.username,
              receiverUsername: input.receiverUsername,
            },
            {
              senderUsername: input.receiverUsername,
              receiverUsername: ctx.session?.user.username,
            },
          ],
        },
      });
      return messages;
    }),
});
