import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
      authorization: {
        params: {
          prompt: "select_account",
          hd: "kiit.ac.in", // Suggests KIIT hosted domain to Google
        },
      },
    }),
    CredentialsProvider({
      id: "kiit-demo-login",
      name: "KIIT Student / Security Demo Login",
      credentials: {
        email: { label: "KIIT Email", type: "email", placeholder: "2205128@kiit.ac.in" },
        role: { label: "Role", type: "text", placeholder: "STUDENT" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email.toLowerCase().trim();
        const isKiit = email.endsWith("@kiit.ac.in");

        if (!isKiit && process.env.NODE_ENV === "production" && process.env.GOOGLE_CLIENT_ID) {
          throw new Error("Only @kiit.ac.in institutional emails are authorized.");
        }

        // Extract roll number if student email (e.g. 2105123@kiit.ac.in)
        const rollMatch = email.match(/^(\d{7})@/);
        const rollNumber = rollMatch ? rollMatch[1] : "Faculty/Staff";
        const isSecurity = credentials.role === "SECURITY" || email.startsWith("security");

        return {
          id: email,
          name: isSecurity ? "Campus 15 Gate Security" : `KIIT Student (${rollNumber})`,
          email: email,
          image: "https://lh3.googleusercontent.com/a/default-user",
          role: isSecurity ? "SECURITY" : "STUDENT",
          rollNumber: rollNumber,
          hostel: "KP-7",
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase() || "";
        // Enforce @kiit.ac.in domain for institutional users, allow developer/test account
        if (!email.endsWith("@kiit.ac.in") && email !== "pratyushsharmadps@gmail.com") {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || (user.email === "pratyushsharmadps@gmail.com" ? "ADMIN" : "STUDENT");
        token.rollNumber = (user as any).rollNumber || (user.email?.match(/^(\d{7})@/)?.[1] ?? (user.email === "pratyushsharmadps@gmail.com" ? "24051871" : ""));
        token.hostel = (user as any).hostel || "KP-7";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).rollNumber = token.rollNumber;
        (session.user as any).hostel = token.hostel;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "kiit_default_secret_key_2026",
  pages: {
    signIn: "/",
  },
};
