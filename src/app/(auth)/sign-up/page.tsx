import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import NewSigninComp from "@/components/NewSigninComp"
const Page = async () => {
    const session = await auth()
    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <NewSigninComp activity="Sign Up" />
        </div>
    )
}
export default Page
