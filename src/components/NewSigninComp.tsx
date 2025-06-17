import { signIn } from "@/lib/auth"
import { Button } from "./ui/button"
import { LogIn } from "lucide-react"
import { Github } from "./magicui/Github"
import Google from "./magicui/Google"

const NewSigninComp = ({ activity }: { activity: string }) => {
    return (
        <>
            <div className="p-6 bg-white rounded-md shadow-md -translate-y-14">
                <h2 className="text-center text-xl text-pretty font-semibold mb-6">
                    {activity} <LogIn className="size-4 inline" />
                </h2>
                <div className="flex flex-col items-center justify-between gap-5 ">
                    <form
                        action={async () => {
                            "use server"
                            await signIn("github", { redirectTo: "/dashboard" })
                        }}
                    >
                        <Button className="w-full" variant="outline">
                            <Github className="" />
                            Continue with GitHub
                        </Button>
                    </form>
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google")
                        }}
                    >
                        <Button className="w-full" variant="outline">
                            <Google size={24} />
                            Continue with Google
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default NewSigninComp
