import { db } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfMonth } from "date-fns"
import { z } from "zod"
import { CATEGORY_NAME_VALIDAOTRS } from "@/lib/validators/category-validators"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"

export const categoryRouter = router({
    getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
        console.log("Staring search ===>>>")

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
        console.log("Categories==>>>", categories)

        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const now = new Date()
                console.log("Category==>>>", category)

                const firstDayOfMonth = startOfMonth(now)
                console.log("date====>", firstDayOfMonth)

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
                                console.log("Events====>", events)
                                const fieldNames = new Set<string>()
                                events.forEach((event) => {
                                    console.log("EVentt====>", event)
                                    Object.keys(event.fields as object).forEach(
                                        (fieldName) => {
                                            console.log(
                                                "Field Name====>",
                                                fieldName
                                            )
                                            fieldNames.add(fieldName)
                                        }
                                    )
                                })
                                console.log("Set====>", fieldNames)
                                return fieldNames.size
                            }),
                        db.event.count({
                            where: {
                                EventCategory: { id: category.id },
                                createdAt: { gte: firstDayOfMonth },
                            },
                        }),
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
        console.log("Last Output===>>>", categoriesWithCounts)
        console.log("search End ===>>>")
        return c.superjson({ categories: categoriesWithCounts })
    }),

    deleteCategory: privateProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ c, input, ctx }) => {
            const { name } = input

            await db.eventCategory.delete({
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
            console.log("Received log")

            const { user } = ctx
            const { color, name, emoji } = input

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
                    { name: "question", emoji: "🤔", color: 0x6c5ce7 },
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
})
