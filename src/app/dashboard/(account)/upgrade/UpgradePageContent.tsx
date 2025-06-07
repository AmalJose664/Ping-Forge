"use client"
import Card from "@/components/ui/customCard"
import { client } from "@/lib/client"
import { Plan } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { BarChart } from "lucide-react"
import { useRouter } from "next/navigation"

const UpgradePageContent = ({ plan }: { plan: Plan }) => {
    const router = useRouter()

    const { mutate: createCheckOutSession } = useMutation({
        mutationFn: async () => {
            const res = await client.payment.createCheckoutSession.$post()
            return res.json()
        },
        onSuccess: ({ url }) => {
            if (url) router.push(url)
        },
    })
    const { data: usageData } = useQuery({
        queryKey: ["usage"],
        queryFn: async () => {
            const res = await client.project.getUsage.$get()
            return await res.json()
        },
    })
    return (
        <div className="max-w-3xl flex flex-col gap-8">
            <div>
                <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
                    {plan === "PRO" ? "Plan: PRO" : "Plan FREE"}
                </h1>
                <p className="text-sm/6 text-gray-600 max-w-prose">
                    {plan === "PRO"
                        ? "Thank you for your supporting PingPanda. Find your increased usage limits below."
                        : "Get access to more events, categories and premium support."}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-brand-700">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-sm/6 font-medium">Total Events</p>
                        <BarChart className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">
                            {usageData?.eventsUsed || 0} of{" "}
                            {usageData?.eventsLimits.toLocaleString() || 100}
                        </p>
                        <p className="text-xs/5 text-muted-foreground">
                            Events this period
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-sm/6 font-medium">
                            Events Categories
                        </p>
                        <BarChart className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">
                            {usageData?.categoriesUsed || 0} of{" "}
                            {usageData?.categoryLimit.toLocaleString() || 10}
                        </p>
                        <p className="text-xs/5 text-muted-foreground">
                            Active Categories
                        </p>
                    </div>
                </Card>
            </div>

            <p className="text-sm text-gray-500">
                Usage will reset{" "}
                {usageData?.resetDate ? (
                    format(usageData.resetDate, "MMM d, yyyy")
                ) : (
                    <span className="animate-pulse w-8 h-4 bg-gray-200"></span>
                )}
                {plan !== "PRO" ? (
                    <span
                        onClick={() => createCheckOutSession()}
                        className="inline cursor-pointer underline text-brand-600"
                    >
                        {" "}
                        or upgrade now to increase your limit &rarr;
                    </span>
                ) : null}
            </p>
        </div>
    )
}
export default UpgradePageContent
