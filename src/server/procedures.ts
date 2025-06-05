import { db } from "@/db"
import { j } from "./__internals/j"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"

const authMiddleware = j.middleware(async ({ next, c }) => {
    const authHeader = c.req.header("Authorization")

    if (authHeader) {
        const apiKey = authHeader.split(" ")[1]
        const user = await db.user.findUnique({
            where: {
                apiKey,
            },
        })
        if (user) {
            return next({ user })
        }
    }
    const auth = await currentUser()
    if (!auth) throw new HTTPException(400, { message: "UnAuthorized" })

    const user = await db.user.findUnique({ where: { externalId: auth.id } })
    if (!user) {
        throw new HTTPException(400, { message: "UnAuthorized" })
    }
    return next({ user })
})
/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)
