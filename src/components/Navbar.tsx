import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Button, buttonVariants } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { auth } from "@/lib/auth"
import SignOutButton from "./SignOutButton"

const Navbar = async () => {
	const session = await auth()
	const user = session

	return (
		<nav className="sticky h-16 z-[100] inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
			<MaxWidthWrapper>
				<div className="flex h-16 items-center justify-between">
					<Link href={"/"} className="flex z-40 font-semibold">
						Ping <span className="text-blue-700">Forge</span>
					</Link>
					<div className="h-full flex items-center space-x-4">
						{user ? (
							<>
								<SignOutButton />
								<Link
									href="/dashboard"
									className={buttonVariants({
										size: "sm",
										className: " flex items-center gap-1",
									})}
								>
									DashBoard{" "}
									<ArrowRight className="ml-1.5 size-4" />
								</Link>
							</>
						) : (
							<>
								<Link
									href="/pricing"
									className={buttonVariants({
										size: "sm",
										variant: "ghost",
									})}
								>
									Pricing
								</Link>
								<Link
									href="/sign-in"
									className={buttonVariants({
										size: "sm",
										variant: "ghost",
									})}
								>
									Sign in
								</Link>
								<div className="h-8 w-px bg-gray-200"></div>
								<Link
									href="/sign-up"
									className={buttonVariants({
										size: "sm",
										className: "flex items-center gap-1.5",
									})}
								>
									Sign up <ArrowRight />
								</Link>
							</>
						)}
					</div>
				</div>
			</MaxWidthWrapper>
		</nav>
	)
}
export default Navbar
