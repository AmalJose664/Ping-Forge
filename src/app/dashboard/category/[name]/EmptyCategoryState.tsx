import CodeSnippet from "@/components/CodeSnippet"
import Card from "@/components/ui/customCard"
import { client } from "@/lib/client"
import { codeSnippets } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { CopyIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism"

const EmptyCategoryState = ({ categoryName }: { categoryName: string }) => {
    const router = useRouter()
    const { data } = useQuery({
        queryKey: ["category", categoryName, "hasEvents"],
        queryFn: async () => {
            const res = await client.category.pollCategory.$get({
                name: categoryName,
            })

            return await res.json()
        },
        refetchInterval(query) {
            return query.state.data?.hasEvents ? false : 1000
        },
    })
    const hasEvents = data?.hasEvents

    useEffect(() => {
        if (hasEvents) router.refresh()
    }, [hasEvents, router])

    const copyCode = () => {
        navigator.clipboard.writeText(codeSnippets.simpleCode.complete)
    }
    return (
        <Card
            className="flex-1 flex items-center justify-center"
            contentClassName="max-w-2xl w-full flex items-center p-6 flex-col"
        >
            <h2 className="text-xl/8 tracking-tight font-medium text-center text-gray-950">
                Create your first {categoryName} event
            </h2>
            <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-pretty text-center">
                Get Started by sending a request to our tracking API:
            </p>
            <CodeSnippet
                fileName="your-first-event.js"
                codeSnippet={codeSnippets.simpleCode.complete}
                copyFunct={copyCode}
            >
                <SyntaxHighlighter
                    language="javascript"
                    style={nightOwl}
                    customStyle={{
                        borderRadius: "0px",
                        margin: "0",
                        padding: "1rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                    }}
                >
                    {codeSnippets.simpleCode.complete}
                </SyntaxHighlighter>
            </CodeSnippet>
            <div className="mt-8 flex flex-col items-center space-x-2">
                <div className="flex gap-2 items-center">
                    <div className="size-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-sm text-gray-600 ">
                        Listening to incoming events...
                    </span>
                </div>
                <p className="text-base text-gray-600 mt-2">
                    Need help? Check out our{" "}
                    <Link
                        href="/dashboard?tutorial=true"
                        className="text-blue-600 hover:underline"
                    >
                        help tab
                    </Link>
                </p>
            </div>
        </Card>
    )
}

export default EmptyCategoryState
