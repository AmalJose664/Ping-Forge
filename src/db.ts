import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV === "production") {
    const adapter = new PrismaNeon(pool)
    prisma = new PrismaClient({ adapter })
} else {
    if (!global.cachedPrisma) {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL })

        const adapter = new PrismaNeon(pool)
        global.cachedPrisma = new PrismaClient({ adapter })
    }
    prisma = global.cachedPrisma
}

export const db = prisma
export const sharedPool = pool
