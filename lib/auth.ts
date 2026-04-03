import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token: _token }) => {
      // In development, the reset URL is printed to the server console.
      // In production, replace this with a real email send (Resend, Nodemailer, etc.).
      console.log(`\n[DEV] Password reset requested for: ${user.email}`);
      console.log(`[DEV] Reset URL: ${url}\n`);
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: async ({ user }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});

export type Auth = typeof auth;
