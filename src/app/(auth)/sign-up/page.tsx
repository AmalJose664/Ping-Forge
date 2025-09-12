import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import NewSigninComp from "@/components/NewSigninComp"
import { authErrorMessages } from "@/utils"
const Page = async ( {searchParams}:{searchParams:{error?:string}}) => {
    const session = await auth()
	const error = searchParams.error 
	
		const message = error ? authErrorMessages[error as string] || authErrorMessages.default : null;
    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <NewSigninComp activity="Sign Up" />
			{message && <p className="text-red-500">{message}</p>}
        </div>
    )
}
export default Page
