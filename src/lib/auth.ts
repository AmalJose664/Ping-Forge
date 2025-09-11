import { sharedPool, db } from "@/db"
import NextAuth from "next-auth"
import crypto from "crypto";
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import NeonAdapter from "@auth/neon-adapter"
import { encrypt, getRandomKey } from "./encryptDecrytp";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: NeonAdapter(sharedPool),
    providers: [Github, Google],
    events: {
		async createUser({user}){
			const key = getRandomKey()
			let result = await db.user.update({
				where: {
					email: user?.email || ""
				},
				data:{
					apiKey: key
				}
			})
			console.log(result)
		}
	},
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl
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
