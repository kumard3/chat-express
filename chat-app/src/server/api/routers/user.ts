import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ input }) => {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        messages: true,
      },
    });
    return users;
  }),
});
