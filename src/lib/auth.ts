import { sharedPool } from "@/db"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import NeonAdapter from "@auth/neon-adapter"

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: NeonAdapter(sharedPool),
    providers: [Github, Google],
    events: {},
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },
        async session({ session, token }) {
            if (token?.sub && token?.role) {
                session.user.id = token.sub
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in",
    },
})
