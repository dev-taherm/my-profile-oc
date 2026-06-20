import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      passwordChanged: boolean;
    };
  }

  interface User {
    passwordChanged?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    passwordChanged?: boolean;
  }
}
