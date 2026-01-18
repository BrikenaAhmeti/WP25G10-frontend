import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type AuthResponse = {
    token: string;
    expiresAt: string;
    userName: string;
    email: string;
};

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const userNameOrEmail = String(credentials?.email ?? "").trim();
                const password = String(credentials?.password ?? "");

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/AuthApi/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userNameOrEmail, password }),
                });

                if (!res.ok) return null;

                const data = (await res.json()) as AuthResponse;

                return {
                    id: data.email,                 // or data.userName
                    name: data.userName,
                    email: data.email,
                    accessToken: data.token,
                    expiresAt: data.expiresAt,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.name = (user as any).name;
                token.email = (user as any).email;
                token.expiresAt = (user as any).expiresAt;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            session.user = {
                ...(session.user || {}),
                name: token.name as string,
                email: token.email as string,
            };
            return session;
        },
    },
    pages: { signIn: "/auth/signin" },
};