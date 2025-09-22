import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { DiscordClient } from "@/lib/discordClient"
import { CATEGORY_NAME_VALIDAOTRS } from "@/lib/validators/category-validators"
import { Prisma, Event } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
const REQUEST_VALIDATOR = z
	.object({
		category: CATEGORY_NAME_VALIDAOTRS,
		fields: z.record(z.string().or(z.number().or(z.boolean()))).optional(),
		description: z.string().optional(),
	})
	.strict()
export let discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)
export const POST = async (req: NextRequest) => {

	try {
		let requestData: unknown
		try {
			requestData = await req.json()

		} catch (err: any) {
			console.log(err, err.message,)

			return NextResponse.json(
				{
					message: "Invalid JSON request bodys",
				},
				{ status: 400 }
			)
		}


		const authHeader = req.headers.get("Authorization")
		if (!authHeader) {
			return NextResponse.json(
				{ message: "UnAuthorized" },
				{ status: 401 }
			)
		}
		if (!authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{
					message:
						"Invalid auth header format. Expected 'Bearer [API_KEY]'",
				},
				{ status: 400 }
			)
		}
		const apiKey = authHeader.split(" ")[1]
		if (!apiKey || apiKey.trim() === "") {
			return NextResponse.json(
				{ message: "Invalid API key" },
				{ status: 400 }
			)
		}

		const currentDate = new Date()
		const currentMonth = currentDate.getMonth() + 1
		const currentYear = currentDate.getFullYear()

		const validationResult = REQUEST_VALIDATOR.parse(requestData)

		const user = await db.user.findUnique({
			where: {
				apiKey: apiKey,
			},
			include: {
				EventCategories: {
					where: { name: validationResult.category }, // Filter categories at DB level
					take: 1 // Only get the one we need
				},
				Quota: {
					where: {
						month: currentMonth,
						year: currentYear,
					},
					take: 1
				},
			}
		})

		if (!user) {
			return NextResponse.json(
				{ message: "Invalid API key or no user was found" },
				{ status: 401 }
			)
		}
		if (!user.discordId) {
			return NextResponse.json(
				{
					message:
						"Please Enter your discord ID in your account setings",
				},
				{ status: 403 }
			)
		}



		const quota = user.Quota && user.Quota.length > 0 ? user.Quota[0] : null

		const quotaLimit =
			user.plan === "FREE"
				? FREE_QUOTA.maxEventsPerMonth
				: PRO_QUOTA.maxEventsPerMonth
		if (quota && quota.count >= quotaLimit) {
			return NextResponse.json(
				{
					message:
						"Monthly quota reached. Please upgrade your plan for more events",
				},
				{ status: 402 }
			)
		}
		if (!discord) {
			discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)
		}




		const category = user.EventCategories[0]

		if (!category) {
			return NextResponse.json(
				{
					message:
						"You dont have a category named " +
						validationResult.category,
				},
				{ status: 404 }
			)
		}
		const eventData = {
			title: `${category.emoji || "🔔"} ${category.name.charAt(0).toUpperCase() + category.name.slice(1)
				}`,
			description:
				validationResult.description ||
				`A new ${category.name} event has occured !`,
			color: category.color,
			timestamp: new Date().toISOString(),
			fields: Object.entries(validationResult.fields || {}).map(
				([key, value]) => {
					if (key.startsWith("untrack_")) {
						key = key.split("untrack_")[1]
					}
					return {
						name: key,
						value: String(value),
						inline: true,
					}
				}
			),
		}

		let event: Event | null = null;

		const dmChannel = await discord.createDm(user.discordId)

		try {

			await discord.sendEmbed(dmChannel.id, eventData)

			event = await db.$transaction(async (tx) => {
				const newEvent = await tx.event.create({
					data: {
						name: category.name,
						formattedMessage: `${eventData.title}\n\n${eventData.description}`,
						userId: user.id,
						fields: validationResult.fields || {},
						eventCategoryId: category.id,
						deliveryStatus: "DELIVERED",
					},
				})
				await tx.quota.upsert({
					where: {
						quota_by_user_month_year: {
							userId: user.id,
							year: currentYear,
							month: currentMonth,
						}
					},
					update: {
						count: { increment: 1 },
					},
					create: {
						userId: user.id,
						month: currentMonth,
						year: currentYear,
						count: 1,
					},
				})
				return newEvent
			})
		} catch (err: any) {

			event = await db.event.create({
				data: {
					name: category.name,
					formattedMessage: `${eventData.title}\n\n${eventData.description}`,
					userId: user.id,
					fields: validationResult.fields || {},
					eventCategoryId: category.id,
					deliveryStatus: "FAILED",
				},
			})
			console.log(err, "Update Error +++++++++++", err.code)
			if (err.code == 50007) {
				return NextResponse.json(
					{
						error: true,
						code: "DISCORD_DM_BLOCKED",
						title: "Direct Message Failed",
						tip:
							"Please enable 'Allow direct messages from server members' in your Discord privacy settings, or add our bot to a server you're in.",
						actionUrl: process.env.NEXT_PUBLIC_APP_URL + "/dashboard/account-settings",
						eventId: event.id,

					}, {
					status: 503
				}
				)
			}
			return NextResponse.json(
				{
					message: "Error processing event",
					eventId: event.id,
				},
				{ status: 503 }
			)

		}

		return NextResponse.json(
			{
				message: "Event processed succesfully",
				eventId: event?.id,
			},
			{ status: 200 }
		)
	} catch (err: any) {
		console.log("Final try", err, err.message)
		if (err.code && err.code == 50033) {
			return NextResponse.json(
				{
					error: true,
					code: "DISCORD_USER_NOT_CONNECTED",
					title: "Invalid User ID",
					tip:
						"Please provide a valid Discord User ID",

				}, {
				status: 503
			}
			)

		}
		if (err.code && err.code == 50035) {
			console.error("Invalid form field:", err.rawError.errors);
			return NextResponse.json(
				{
					error: true,
					code: "DISCORD_INVALID_PAYLOAD",
					title: "Discord API Error",
					description: "Failed to ping due to invalid data or invalid Discord ID",
					details: err.rawError.errors,

				}, {
				status: 503
			}
			)

		}

		if (
			err instanceof Prisma.PrismaClientUnknownRequestError &&
			err.message.includes("invalid input syntax for type uuid")
		) {
			return NextResponse.json(
				{ message: "Invalid api key || No User was found" },
				{ status: 404 }
			)
		}

		if (err instanceof z.ZodError) {
			return NextResponse.json(
				{ message: err.message + " || No category was found " },
				{ status: 422 }
			)
		}
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		)
	}
}
