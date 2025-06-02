import Heading from "@/components/Heading"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Check } from "lucide-react"
import ShinyButton from "@/components/ShinyButton"
import MockDiscordUi from "@/components/MockDiscordUi"

const page = () => {
    return (
        <>
            <section className="relative py-24 sm:py-32 bg-brand-25 ">
                <MaxWidthWrapper className="text-center">
                    <div className="relative mx-auto text-center flex flex-col items-center gap-10">
                        <div>
                            <Heading>
                                <span>Real-Time Saas Insights,</span>
                                <br />
                                <span className="relative bg-gradient-to-r from-brand-700 to-brand-800 text-transparent bg-clip-text">
                                    Delivered to Your Discord
                                </span>
                            </Heading>
                        </div>
                        <p className="text-base/7 text-gray-600 max-w-prose text-center text-pretty">
                            Ping Panda is the easiest way to monitor your SaaS.
                            Get instant notifications for{" "}
                            <span className="font-semibold text-gray-700">
                                sales, new users, or any other event
                            </span>{" "}
                            sent directly to your Discord.
                        </p>

                        <ul className="space-y-2 text-base/7 text-gray-600 text-left flex flex-col  sm:items-start">
                            {[
                                "Real-time Discord alerts for critical events",
                                "Buy once, use forever",
                                "Track sales, new users, or any other vents",
                            ].map((item, indx) => (
                                <li
                                    key={indx}
                                    className="flex gap-1.5 items-center text-left "
                                >
                                    <Check className="size-5 shrink-0 text-brand-700" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="w-full max-w-80">
                            <ShinyButton
                                href="/sign-up"
                                className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl "
                            >
                                Start For Free Today
                            </ShinyButton>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </section>

            <section className="relative bg-brand-25 pb-4">
                <div className="absolute inset-x-0 bottom-24 top-24 bg-brand-700" />
                <div className="relative mx-auto ">
                    <MaxWidthWrapper className="relative">
                        <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            <MockDiscordUi></MockDiscordUi>
                        </div>
                    </MaxWidthWrapper>
                </div>
            </section>
            <section></section>
            <section></section>
        </>
    )
}
export default page
