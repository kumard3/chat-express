import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { z } from "zod";
import { env } from "@/env";
const loginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    id: string;
    username: string;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          userId: token?.id,
          username: token?.username ?? "",
        },
      };
    },
    async jwt({ token, account, user }) {
      console.log(user, "user");
      console.log(token, "token");
      console.log(account, "account");
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.image = user.image;

      }
      return { ...token};
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      type: "credentials",
      authorize: async (credentials) => {
        const { username, password } = loginUserSchema.parse(credentials);
        // Fetch the user from the database based on the provided username
        const user = await db.user.findUnique({
          where: { username: username },
        });

        if (user && bcrypt?.compareSync(password, user.password)) {
          // Include the desired user properties in the session
          return Promise.resolve({
            id: user.id,
            username: user.username,
          });
        } else {
          return Promise.resolve(null);
        }
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signup",
    signOut: "/login",
    error: "/login",
    verifyRequest: "/login",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
