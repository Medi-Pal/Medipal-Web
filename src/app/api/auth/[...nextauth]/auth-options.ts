import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
          return null;
        }

        try {
          const user = await prisma.doctor.findUnique({
            where: { Registration_No: credentials.licenseNumber },
          });

          if (user) {
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (passwordMatch) {
              if (!user.isVerified) {
                // If the doctor is not verified, return a special indicator
                return {
                  id: user.Registration_No,
                  email: user.Email,
                  name: user.Name,
                  role: "unverified",
                  licenseNumber: user.Registration_No,
                };
              }

              return {
                id: user.Registration_No,
                email: user.Email,
                name: user.Name,
                role: "doctor",
                licenseNumber: user.Registration_No,
              };
            }
          }
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