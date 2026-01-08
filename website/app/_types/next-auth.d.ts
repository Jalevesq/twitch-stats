import "next-auth";

declare module "next-auth" {
  interface User {
    isValid?: boolean;
  }

  interface Session {
    user: User & {
      isValid?: boolean;
    };
  }
}
