import { signOut } from "@/lib/auth"
import { Button } from "./ui/button"

const SignOutButton = () => {
    return (
        <>
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <Button size="sm" variant="ghost">
                    Sign out
                </Button>
            </form>
        </>
    )
}
export default SignOutButton
