import Card from "@/components/ui/customCard"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { CopyIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

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
    const codeSnippet = `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    category: '${categoryName}',
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`
    const copyCode = () => {
        navigator.clipboard.writeText(codeSnippet)
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
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <div className="size-3 rounded-full bg-yellow-500" />
                        <div className="size-3 rounded-full bg-green-500" />
                    </div>

                    <div className="flex gap-3 items-center relative">
                        <CopyIcon
                            className="size-4 mr-1"
                            color="white"
                            onClick={copyCode}
                        />
                        <span className="text-gray-400 text-sm">
                            yor-first-event.js
                        </span>
                    </div>
                </div>
                <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    customStyle={{
                        borderRadius: "0px",
                        margin: "0",
                        padding: "1rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                    }}
                >
                    {codeSnippet}
                </SyntaxHighlighter>
            </div>
            <div className="mt-8 flex flex-col items-center space-x-2">
                <div className="flex gap-2 items-center">
                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
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
