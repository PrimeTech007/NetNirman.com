import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email as string,
        }).select("+passwordHash");

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (!user.isActive) {
          throw new Error("Account is disabled");
        }

        if (user.isLocked()) {
          throw new Error("Account is locked. Try again in 15 minutes.");
        }

        const isValid = await user.comparePassword(credentials.password as string);

        if (!isValid) {
          await user.incrementLoginAttempts();
          throw new Error("Invalid credentials");
        }

        await user.resetLoginAttempts();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, string>).id = token.id as string;
        (session.user as unknown as Record<string, string>).role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      if (isOnAdmin && !isLoggedIn) {
        return Response.redirect(new URL("/admin/login", nextUrl));
      }

      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };
