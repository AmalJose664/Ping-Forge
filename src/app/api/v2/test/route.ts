import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { DiscordClient } from "@/lib/discordClient"
import { CATEGORY_NAME_VALIDAOTRS } from "@/lib/validators/category-validators"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

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

        try {
            await discord.sendTest(dmChannel.id)
        } catch (err) {
            console.log(err)

            return NextResponse.json(
                {
                    message: "Error processing event",
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                message: "Event processed succesfully",
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.log("Final try", err, err.message)

        if (err instanceof z.ZodError) {
            return NextResponse.json({ message: err.message }, { status: 422 })
        }
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
