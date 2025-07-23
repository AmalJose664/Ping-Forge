import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { redirect } from "next/navigation"
import DashboardPageContent from "./DashboardPageContent"
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { createCheckoutSession } from "@/lib/stripe"
import PaymentSuccessModal from "@/components/PaymentSuccessModal"
import DashboardTutorial from "./DashboardTutorial"
import { auth } from "@/lib/auth"
interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Dashboard = async ({ searchParams }: PageProps) => {
    const session = await auth()
    if (!session) redirect("/sign-in")
    const user = await db.user.findUnique({ where: { id: session?.user?.id } })

	

    if (!user) redirect("/sign-in")

    const intent = searchParams.intent
    if (intent === "upgrade") {
        const session = await createCheckoutSession({
            userEmail: user.email || "",
            userId: user.id,
        })
        if (session.url) redirect(session.url)
    }
    const success = searchParams.success
    let tutorial = searchParams.tutorial
    if (success && tutorial) tutorial = undefined
    const addCategory = searchParams.addcategory
	
    return (
        <>
            {success && <PaymentSuccessModal />}
            {tutorial && (
                <div className="relative ">
                    <DashboardTutorial />
                </div>
            )}
            <DashboardPage hideBackButton={true}
                cta={
                    <CreateEventCategoryModal addStart={!!addCategory}>
                        <Button className="w-full sm:w-fit">
                            <PlusIcon className="size-4 mr-2" />
                            Add Category
                        </Button>
                    </CreateEventCategoryModal>
                }
                title="DashBoard"
            >
                <DashboardPageContent />
            </DashboardPage>
        </>
    )
}
export default Dashboard
