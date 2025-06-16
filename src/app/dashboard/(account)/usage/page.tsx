import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { redirect } from "next/navigation"
import UpgradePageContent from "./UpgradePageContent"
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
        <DashboardPage title="Plan Usage">
            <UpgradePageContent plan={user.plan} />
        </DashboardPage>
    )
}
export default Page
