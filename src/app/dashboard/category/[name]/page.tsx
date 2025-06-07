import CategoryPageContent from "@/app/dashboard/category/[name]/CategoryPageContent"
import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

interface PageProps {
    params: {
        name: string | string[] | undefined
    }
}
const page = async ({ params }: PageProps) => {
    if (typeof params.name !== "string") notFound()
    const auth = await currentUser()
    if (!auth) {
        redirect("/sign-in")
    }
    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    })
    if (!user) redirect("/sign-in")
    const category = await db.eventCategory.findUnique({
        where: {
            name_userId: {
                name: params.name,
                userId: user.id,
            },
        },
        include: {
            _count: {
                select: { events: true },
            },
        },
    })
    if (!category) {
        return notFound()
    }
    const hasEvents = category._count.events > 0
    return (
        <DashboardPage title={`${category.emoji} ${category.name} events`}>
            <CategoryPageContent category={category} hasEvents={hasEvents} />
        </DashboardPage>
    )
}
export default page
