import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { getRuntimeEnvValue } from "@/lib/runtime-env";

const credentialsSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1)
});

async function getAdminAuthConfig() {
  const [adminIdentifier, adminPassword] = await Promise.all([
    getRuntimeEnvValue(["ADMIN_USER", "ADMIN_USEREMAIL", "ADMIN_EMAIL"]),
    getRuntimeEnvValue(["ADMIN_PASS", "ADMIN_PASSWORD"])
  ]);

  return {
    adminIdentifier: adminIdentifier?.trim() || "",
    adminPassword: adminPassword?.trim() || ""
  };
}

export async function isAdminAuthConfigured() {
  const { adminIdentifier, adminPassword } = await getAdminAuthConfig();

  return adminIdentifier.length > 0 && adminPassword.length > 0;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "maison-elite-dev-secret",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Maison Elite Admin",
      credentials: {
        identifier: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const submittedCredentials = credentials as Record<string, string | undefined> | null;
        const parsed = credentialsSchema.safeParse({
          identifier:
            typeof submittedCredentials?.identifier === "string"
              ? submittedCredentials.identifier
              : typeof submittedCredentials?.email === "string"
                ? submittedCredentials.email
                : typeof submittedCredentials?.username === "string"
                  ? submittedCredentials.username
                  : "",
          password:
            typeof submittedCredentials?.password === "string"
              ? submittedCredentials.password
              : ""
        });

        if (!parsed.success) {
          return null;
        }

        const { adminIdentifier, adminPassword } = await getAdminAuthConfig();

        if (!adminIdentifier || !adminPassword) {
          return null;
        }

        if (
          parsed.data.identifier.toLowerCase() === adminIdentifier.toLowerCase() &&
          parsed.data.password === adminPassword
        ) {
          return {
            id: "maison-elite-admin",
            name: "Maison Elite Admin",
            email: parsed.data.identifier,
            role: "admin"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "admin";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "admin";
      }

      return session;
    }
  }
};

export function auth() {
  return getServerSession(authOptions);
}
