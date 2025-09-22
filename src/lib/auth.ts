import { sharedPool, db } from "@/db"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import NeonAdapter from "@auth/neon-adapter"
import { getRandomKey } from "./encryptDecrytp";
import { selfPing } from "./selfPing"
// skip prerendering
export const runtime = "nodejs";
export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: NeonAdapter(sharedPool),
	providers: [Github, Google],
	events: {
		async createUser({ user }) {
			const key = getRandomKey()

			await db.user.update({
				where: {
					email: user?.email || ""
				},
				data: {
					apiKey: key
				}
			})
			void selfPing({ email: user.email || "", name: user.name || "" })

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
