import { signIn } from "@/lib/auth"
import { Button } from "./ui/button"
import {} from 'lucide-react'
import { Github } from "./magicui/Github"
import Google from "./magicui/Google"

const NewSigninComp = () => {
    return (
        <>
		<form
            action={async () => {
                "use server"
                await signIn("github")
            }}
        >
            <Button className="w-full" variant="outline">
                <Github />
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
                <Google size={24}/>
                Continue with Google
            </Button>
        </form>
		</>
    )
}
export default NewSigninComp
