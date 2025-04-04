import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    licenseNumber?: string;
  }

  interface Session {
    user: User & {
      role?: string;
      licenseNumber?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    licenseNumber?: string;
  }
}
