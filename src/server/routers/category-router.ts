import { db } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { z } from "zod"
import { CATEGORY_NAME_VALIDAOTRS } from "@/lib/validators/category-validators"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"

export const categoryRouter = router({
	getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
		const categories = await db.eventCategory.findMany({
			where: { userId: ctx.user.id },
			select: {
				id: true,
				name: true,
				emoji: true,
				color: true,
				updatedAt: true,
				createdAt: true,
			},
			orderBy: { updatedAt: "desc" },
		})

		const categoriesWithCounts = await Promise.all(
			categories.map(async (category) => {
				const now = new Date()

				const firstDayOfMonth = startOfMonth(now)

				const [uniqueFieldCount, eventsCounts, lastPing] =
					await Promise.all([
						db.event
							.findMany({
								where: {
									EventCategory: { id: category.id },
									createdAt: { gte: firstDayOfMonth },
								},
								select: { fields: true },
								distinct: ["fields"],
							})
							.then((events) => {
								const fieldNames = new Set<string>()
								events.forEach((event, i) => {
									Object.keys(event.fields as object).forEach(
										(fieldName) => {
											fieldNames.add(fieldName)
										}
									)
								})
								return fieldNames.size
							}),
						// second array element
						db.event.count({
							where: {
								EventCategory: { id: category.id },
								createdAt: { gte: firstDayOfMonth },
							},
						}),
						// third array element
						db.event.findFirst({
							where: { EventCategory: { id: category.id } },
							orderBy: { createdAt: "desc" },
							select: { createdAt: true },
						}),
					])

				return {
					...category,
					uniqueFieldCount,
					eventsCounts,
					lastPing: lastPing?.createdAt || null,
				}
			})
		)
		return c.superjson({ categories: categoriesWithCounts })
	}),

	deleteCategory: privateProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ c, input, ctx }) => {
			const { name } = input


			const result = await db.eventCategory.delete({
				where: {

					name_userId: { name, userId: ctx.user.id },
				},
			})


			return c.json({ success: true })
		}),

	createEventCategory: privateProcedure
		.input(
			z.object({
				name: CATEGORY_NAME_VALIDAOTRS,
				color: z
					.string()
					.min(1, "Color is required")
					.regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
				emoji: z.string().emoji("Invalid emoji").optional(),
			})
		)
		.mutation(async ({ c, input, ctx }) => {
			const { user } = ctx
			const { color, name, emoji } = input
			const categoryCount = await db.eventCategory.count({
				where: { userId: user.id },
			})

			//return c.json({ eventCategory: "" })

			if (
				user.plan === "FREE" &&
				categoryCount > FREE_QUOTA.maxEventCategories
			) {
				throw new HTTPException(404, {
					message: `Max Categories reached for ${user.plan} plan`,
				})
			} else if (
				user.plan === "PRO" &&
				categoryCount > PRO_QUOTA.maxEventCategories
			) {
				throw new HTTPException(404, {
					message: `Max Categories reached for ${user.plan} plan`,
				})
			}

			const eventCategory = await db.eventCategory.create({
				data: {
					name: name.toLowerCase(),
					color: parseColor(color),
					emoji: emoji,
					userId: user.id,
				},
			})

			return c.json({ eventCategory })
		}),
	insertQuickCategories: privateProcedure.mutation(
		async ({ c, ctx, input }) => {
			const categories = await db.eventCategory.createMany({
				data: [
					{ name: "bug", emoji: "🐛", color: 0xff6b6b },
					{ name: "sale", emoji: "💰", color: 0xffeb3b },
					{ name: "sign-up", emoji: "👤", color: 0x6c5ce7 },
				].map((category) => {
					return { ...category, userId: ctx.user.id }
				}),
			})
			return c.json({ success: true, count: categories.count })
		}
	),

	pollCategory: privateProcedure
		.input(z.object({ name: CATEGORY_NAME_VALIDAOTRS }))
		.query(async ({ c, ctx, input }) => {
			const { name } = input
			const category = await db.eventCategory.findUnique({
				where: { name_userId: { name, userId: ctx.user.id } },
				include: {
					_count: {
						select: {
							events: true,
						},
					},
				},
			})

			if (!category) {
				throw new HTTPException(404, {
					message: `Category '${name} not found'`,
				})
			}
			const hasEvents = category._count.events > 0

			return c.json({ hasEvents })
		}),
	getEventsByCategoryName: privateProcedure
		.input(
			z.object({
				name: CATEGORY_NAME_VALIDAOTRS,
				page: z.number(),
				limit: z.number().max(50),
				timeRange: z.enum(["today", "week", "month"]),
			})
		)
		.query(async ({ c, ctx, input }) => {
			const { limit, name, page, timeRange } = input
			const now = new Date()

			let startDate: Date

			switch (timeRange) {
				case "today": {
					startDate = startOfDay(now)
					break
				}
				case "week": {
					startDate = startOfWeek(now, { weekStartsOn: 0 })
					break
				}
				case "month": {
					startDate = startOfMonth(now)
					break
				}
			}
			const [events, eventsCount, uniqueFields] = await Promise.all([
				db.event.findMany({
					where: {
						EventCategory: { name: name, userId: ctx.user.id },
						createdAt: { gte: startDate },
					},
					skip: (page - 1) * limit,
					take: limit,
					orderBy: { createdAt: "desc" },
				}),
				db.event.count({
					where: {
						EventCategory: { name: name, userId: ctx.user.id },
						createdAt: { gte: startDate },
					},
				}),
				db.event
					.findMany({
						where: {
							EventCategory: { name: name, userId: ctx.user.id },
							createdAt: { gte: startDate },
						},
						select: {
							fields: true,
						},
						distinct: ["fields"],
					})
					.then((events) => {
						const fieldNames = new Set<string>()
						events.forEach((event) => {
							Object.keys(event.fields as object).forEach(
								(fieldName) => {
									fieldNames.add(fieldName)
								}
							)
						})
						return Array.from(fieldNames)
					}),
			])
			return c.superjson({ events, eventsCount, uniqueFields })
		}),
})
