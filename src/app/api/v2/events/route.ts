import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { DiscordClient } from "@/lib/discordClient"
import { CATEGORY_NAME_VALIDAOTRS } from "@/lib/validators/category-validators"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
const REQUEST_VALIDATOR = z
    .object({
        category: CATEGORY_NAME_VALIDAOTRS,
        fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
        description: z.string().optional(),
        url: z.string().url().optional(),
        iconAvatar: z.string().optional(),
        imageBg: z.string().url().optional(),
        codeSnippet: z.string().optional(),
        footer: z
            .object({
                text: z.string().default("Author").optional(),
                icon_url: z.string().optional(),
            })
            .optional(),
        outline: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
        author: z
            .object({
                name: z.string().default("Author"),
                url: z.string().optional().default(""),
                icon_url: z.string().optional(),
            })
            .optional(),
    })
    .strict()
export const POST = async (req: NextRequest) => {
    try {
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
        const user = await db.user.findUnique({
            where: {
                apiKey: apiKey,
            },
            include: { EventCategories: true },
        })
        if (!user) {
            return NextResponse.json(
                { message: "Invalid API key || No user was found" },
                { status: 401 }
            )
        }
        if (!user.discordId) {
            return NextResponse.json(
                {
                    message:
                        "Please Enter your discord ID in your account setings, No discord id found",
                },
                { status: 403 }
            )
        }

        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()

        const quota = await db.quota.findUnique({
           	where: {
					quota_by_user_month_year:{
						userId: user.id,
						year: currentYear,
						month: currentMonth,
					}
				},
        })
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
        const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)
        const dmChannel = await discord.createDm(user.discordId)

        let requestData: unknown
        try {
            requestData = await req.json()
        } catch (err: any) {
            console.log(err, err.message)

            return NextResponse.json(
                {
                    message: "Invalid JSON request bodys",
                },
                { status: 400 }
            )
        }
        const validationResult = REQUEST_VALIDATOR.parse(requestData)

        const category = user.EventCategories.find(
            (cat) => cat.name === validationResult.category
        )

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
            title: `${category.emoji || "🔔"} ${
                category.name.charAt(0).toUpperCase() + category.name.slice(1)
            }`,
            description:
                (validationResult.description ||
                    `A new ${category.name} event has occured !`) +
                " \n```\n " +
                validationResult.codeSnippet +
                "\n```",

            color: category.color,
            thumbnail: {
                url: validationResult.iconAvatar || "",
            },

            image: {
                url: validationResult.imageBg || "",
            },

            timestamp: new Date().toISOString(),
            url: validationResult.url || "",
            author: {
                name: validationResult.author?.name || "",
                url: validationResult.author?.url || "",
                icon_url: validationResult.author?.icon_url || "",
            },
            fields: [
                ...Object.entries(validationResult.fields || {}).map(
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
                ...Object.entries(validationResult.outline || {}).map(
                    ([key, value]) => {
                        return {
                            name: key,
                            value: String("> " + value),
                            inline: false,
                        }
                    }
                ),
            ],
            footer: {
                text: validationResult.footer?.text || "",
                icon_url: validationResult.footer?.icon_url || "",
            },
        }

        const event = await db.event.create({
            data: {
                name: category.name,
                formattedMessage: `${eventData.title}\n\n${eventData.description}`,
                userId: user.id,
                fields: validationResult.fields || {},
                eventCategoryId: category.id,
            },
        })

        try {
            await discord.sendNiceEmbed(dmChannel.id, eventData)
            await db.event.update({
                where: {
                    id: event.id,
                },
                data: {
                    deliveryStatus: "DELIVERED",
                },
            })
            await db.quota.upsert({
                where: {
					quota_by_user_month_year:{
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
                }
			})
        } catch (err:any) {
            await db.event.update({
                where: { id: event.id },
                data: { deliveryStatus: "FAILED" },
            })
            console.log(err)
			if (err.code == 50007){
				return NextResponse.json(
					{
						error: true,
						code: "DISCORD_DM_BLOCKED",
						title: "Direct Message Failed",
						description:
						"We couldn't send you a direct message on Discord.",
						reason:
						"You may have disabled DMs from server members or haven't added the bot to any server.",
						suggestion:
						"Please enable 'Allow direct messages from server members' in your Discord privacy settings, or add our bot to a server you're in.",
						actionUrl: process.env.NEXT_PUBLIC_APP_URL + "/dashboard/account-settings",
					 	eventId: event.id,
						
					},{
						status: 403 
					}
				)
				
			}
            return NextResponse.json(
                {
                    message: "Error processing event",
                    eventId: event.id,
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                message: "Event processed succesfully",
                eventId: event.id,
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.log("Final try", err, err.message)
		if (err.code && err.code == 50033){
			return NextResponse.json(
				{
					error: true,
					code: "DISCORD_USER_NOT_CONNECTED",
					title: "Invalid User ID",
					description:
					"We couldn't send you a direct message on Discord.",
					suggestion:
					"Please provide a valid Discord User ID",
					
				},{
					status: 400
				}
			)
			
		}
		if (err.code && err.code == 50035){
			console.error("Invalid form field:", err.rawError.errors);
			return NextResponse.json(
				{
					error: true,
					code: "DISCORD_INVALID_PAYLOAD",
					title: "Discord API Error",
					description: "Failed to send due to invalid data or invalid Discord ID",
					details: err.rawError.errors,
					
				},{
					status: 400
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
