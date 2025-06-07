import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ApiSettings from "./ApiSettings"

const Page = async () => {
    const auth = await currentUser()
    if (!auth) {
        redirect("/sign-in")
    }
    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    })
    if (!user) redirect("/sign-in")

    return (
        <DashboardPage title="Api Key">
            <ApiSettings apiKey={user.apiKey ?? ""} />
        </DashboardPage>
    )
}
export default Page
