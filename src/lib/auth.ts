import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./db";
import { ensurePortfolioSlugAvailable, getDefaultPortfolioSlug } from "@/lib/portfolioUsers";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) throw new Error("Invalid email or password");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid email or password");

        let portfolioSlug = user.portfolioSlug;
        if (!portfolioSlug) {
          try {
            portfolioSlug = await ensurePortfolioSlugAvailable(
              getDefaultPortfolioSlug(user),
              user._id.toString()
            );
          } catch {
            portfolioSlug = `portfolio-${user._id.toString().slice(-6)}`;
          }

          await User.findByIdAndUpdate(user._id, { portfolioSlug });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          portfolioSlug,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.portfolioSlug = user.portfolioSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.portfolioSlug = token.portfolioSlug;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
