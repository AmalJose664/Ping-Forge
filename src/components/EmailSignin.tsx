import { signIn } from "@/lib/auth"
import { Button } from "./ui/button"
const EmailSignin = () => {
    return (
        <div>
            <form
                action={async (formData) => {
                    "use server"
                    await signIn("resend", formData)
                }}
            >
                <input type="text" name="email" placeholder="Email" /> <br />
                <Button variant={"outline"} type="submit">
                    Signin with Resend
                </Button>
            </form>
        </div>
    )
}
export default EmailSignin
