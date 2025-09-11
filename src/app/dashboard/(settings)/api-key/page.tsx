import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { redirect } from "next/navigation"
import ApiSettings from "./ApiSettings"
import { auth } from "@/lib/auth"

const Page = async () => {
    const session = await auth()
    if (!session) {
        redirect("/sign-in")
    }
    const user = await db.user.findUnique({
        where: { id: session.user?.id },
    })
	
    if (!user) redirect("/sign-in")

    return (
        <DashboardPage title="Api Key">
            <ApiSettings apiKey={user.apiKey ?? ""} />
        </DashboardPage>
    )
}
export default Page
