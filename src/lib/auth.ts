import { sharedPool } from "@/db"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import NeonAdapter from "@auth/neon-adapter"
import Resend from "next-auth/providers/resend"

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: NeonAdapter(sharedPool),
    providers: [Github, Google],
    events: {},
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },
    },
    // pages:{
    // 	signIn:"/sign-in",

    // }
})
