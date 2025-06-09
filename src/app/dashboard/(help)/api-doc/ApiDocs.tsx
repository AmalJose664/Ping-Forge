"use client"
import { codeSnippets } from "@/utils"
import { CopyIcon, Info } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const ApiDocs = () => {
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
    }
    return (
        <div className="max-w-3xl flex flex-col gap-8">
            <div className="p-6 bg-white rounded">
                <h1 className="my-2 text-xl/8 font-medium tracking-tight text-gray-900">
                    Basic Request
                </h1>
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
                                onClick={() =>
                                    copyCode(codeSnippets.simpleCode.complete)
                                }
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
                        {codeSnippets.simpleCode.complete}
                    </SyntaxHighlighter>
                </div>
                <h1 className="my-2 text-lg/8 font-medium tracking-tight text-gray-900">
                    Fields
                </h1>
                <div className="w-full max-w-3xl mb-5 bg-white rounded-lg shadow-lg overflow-hidden">
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
                                onClick={() =>
                                    copyCode(codeSnippets.simpleCode.fields)
                                }
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
                        {codeSnippets.simpleCode.fields}
                    </SyntaxHighlighter>
                </div>

                <p className="text-base text-gray-950 mt-2">
                    <Info className="size-4 inline" /> Field containing
                    'Untrack_' will be excluded from showing in categories{" "}
                    <br />
                    <Info className="size-4 inline" /> Field containing
                    'Untrack_' will be excluded from showing in categories
                </p>
            </div>
        </div>
    )
}
export default ApiDocs
