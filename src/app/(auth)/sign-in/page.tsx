import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
const Page = async () => {
    const session = await auth()
    if (session) redirect("/")

    return (
        <div className="w-full flex-1 flex items-center justify-center"></div>
    )
}
export default Page
