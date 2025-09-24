import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import NewSigninComp from "@/components/NewSigninComp"
import EmailSignin from "@/components/EmailSignin"
export const dynamic = "force-dynamic"
import { authErrorMessages } from "@/utils"
const Page = async ({ searchParams }: { searchParams: { error?: string } }) => {
	//const searchParams = useSearchParams()
	const error = searchParams.error


	const message = error ? authErrorMessages[error as string] || authErrorMessages.default : null;
	const session = await auth()
	if (session) {
		redirect("/dashboard")
	}

	return (
		<div className="w-full flex-1 flex items-center flex-col justify-center">
			<NewSigninComp activity="Sign In" />
			{message && <p className="text-red-500">{message}</p>}
		</div>
	)
}
export default Page
