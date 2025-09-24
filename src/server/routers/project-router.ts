import { addMonths, startOfMonth } from "date-fns"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/db"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { z } from "zod"
import { getRandomKey } from "@/lib/encryptDecrytp"
import { Prisma } from "@prisma/client"
export const runtime = "nodejs";

export const projectRouter = router({
	getUsage: privateProcedure.query(async ({ c, ctx }) => {
		const { user } = ctx
		const currentDate = startOfMonth(new Date())

		const quota = await db.quota.findFirst({
			where: {
				userId: user.id,
				year: currentDate.getFullYear(),
				month: currentDate.getMonth() + 1,
			},
		})

		const eventCount = quota?.count ?? 0
		const categoryCount = await db.eventCategory.count({
			where: { userId: user.id },
		})

		const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA

		const resetDate = addMonths(currentDate, 1)

		return c.json({
			categoriesUsed: categoryCount,
			categoryLimit: limits.maxEventCategories,
			eventsUsed: eventCount,
			eventsLimits: limits.maxEventsPerMonth,
			resetDate,
		})
	}),

	setDiscordId: privateProcedure
		.input(z.object({ discordId: z.string().max(20) }))
		.mutation(async ({ c, ctx, input }) => {
			const { user } = ctx

			const { discordId } = input

			await db.user.update({
				where: { id: user.id },
				data: {
					discordId,
				},
			})
			return c.json({ success: true })
		}),

	resetApiKey: privateProcedure.mutation(async ({ c, ctx }) => {
		const { user } = ctx
		const key = getRandomKey()

		let result = await db.user.update({
			where: {
				email: user?.email || ""
			},
			data: {
				apiKey: key
			}
		})

		//			console.log(result)
		console.log("makeing kkey ", key)
		return c.json({ success: true, key: key })
	})
	,
	ipInfo: privateProcedure
		.input(z.object({ c_date: z.date(), data: z.string() }))
		.query(async ({ c, ctx, input }) => {

			const { user } = ctx
			const { c_date, data } = input
			const forwarded = c.req.header('x-forwarded-for') || c.req.raw.headers.get('x-forwarded-for')
			const key = process.env.IPIFY_APIKEY
			if (!key) {
				console.log("Telemetry API Key missing..")
				return c.json({ success: false, working: "ok" })
			}
			const ipResponse = await fetch(`https://api.ipstack.com/${data || forwarded}?access_key=${key}`)
			const ipData = await ipResponse.json()


			const rajam = ipData.country_name
			const salam = ipData.region_name
			const city = ipData.city
			if ((!rajam && !salam && !city) || !ipData) {
				console.log("No data was found...")
				return c.json({ success: false, working: "ok" })
			}

			const dbData = await db.event.findFirst({
				where: {
					AND: [
						{
							fields: {
								path: ['email'],
								string_contains: user.email || ""
							}
						},
						{
							fields: {
								path: ['name'],
								string_contains: user.name || ""
							},
						}
					]
				}
			})
			const strData = { ...dbData?.fields as Prisma.JsonObject }

			if (strData) {
				strData["location"] = salam || "NA"
				strData["city"] = city || "NA"
				strData["country"] = rajam || "NA"
				const newFields = { ...strData }
				console.log(newFields)
				await db.event.update({
					where: { id: dbData?.id },
					data: {
						fields: newFields
					}
				})
				console.log("updated fields")

			}
			console.log(strData)
			return c.json({ success: true, working: "ok" })
		})
})
