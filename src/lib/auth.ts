import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide NEXTAUTH_SECRET environment variable");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        licenseNumber: { label: "License Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.licenseNumber || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log(
            "Searching for doctor with license:",
            credentials.licenseNumber
          );
          const user = await prisma.doctor.findUnique({
            where: { Registration_No: credentials.licenseNumber },
          });

          console.log("Found user:", user ? "yes" : "no");

          if (user) {
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            console.log("Password match:", passwordMatch);

            if (passwordMatch) {
              console.log("Password matched, creating session");
              return {
                id: user.Registration_No,
                email: user.Email || user.Registration_No + "@medipal.com",
                name: user.Name,
                role: "doctor",
                licenseNumber: user.Registration_No,
              };
            }
          }

          console.log("Invalid credentials");
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.licenseNumber = user.licenseNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.licenseNumber = token.licenseNumber as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
