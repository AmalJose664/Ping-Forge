"use client"
import CodeSnippet from "@/components/CodeSnippet"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { codeSnippets } from "@/utils"
import { CopyIcon, Info } from "lucide-react"
import Link from "next/link"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl as atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const ApiDocs = () => {
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
    }
    return (
        <div className="max-w-3xl flex flex-col gap-8">
            <div className="p-6 bg-white rounded">
                <h1 className="my-3 text-2xl/8 font-medium tracking-tight text-gray-900">
                    Basic Request
                </h1>
                <CodeSnippet
                    fileName="basic-code.js"
                    codeSnippet={codeSnippets.simpleCode.complete}
                    copyFunct={copyCode}
                >
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
                </CodeSnippet>

                <h1 className="my-2 text-lg/8 font-medium tracking-tight text-gray-900">
                    Fields
                </h1>
                <CodeSnippet
                    fileName="fields.js"
                    codeSnippet={codeSnippets.simpleCode.fields}
                    copyFunct={copyCode}
                >
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
                </CodeSnippet>

                <div>
                    <div className="flex items-center justify-start gap-2">
                        <span className="mt-1">
                            {" "}
                            <Info className="size-5 inline" />
                        </span>{" "}
                        <p className="text-base text-gray-950 mt-2">
                            Fields starting with 'untrack_' will be excluded
                            from showing in categories
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <span className="mt-1">
                            {" "}
                            <Info className="size-5 inline" />
                        </span>{" "}
                        <p className="text-base text-gray-950 mt-2">
                            Fields count should not exceed 25
                        </p>
                    </div>
                </div>
            </div>

            {/* second code  */}
            {/* second code  */}
            {/* second code  */}
            {/* second code  */}
            {/* second code  */}

            <div className="p-6 bg-white rounded">
                <h1 className="my-3 text-2xl/8 font-medium tracking-tight text-gray-900">
                    Detailed Response
                </h1>
                <CodeSnippet
                    fileName="detailed.js"
                    codeSnippet={codeSnippets.detailedCode.simple}
                    copyFunct={copyCode}
                >
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
                        {codeSnippets.detailedCode.simple}
                    </SyntaxHighlighter>
                </CodeSnippet>
                <h1 className="my-2 text-lg/8 font-medium tracking-tight text-gray-900">
                    Fields
                </h1>

                <CodeSnippet
                    fileName="fields.js"
                    codeSnippet={codeSnippets.detailedCode.fields}
                    copyFunct={copyCode}
                >
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
                </CodeSnippet>

                <div className="flex items-center justify-start gap-2">
                    <span className="mt-1">
                        {" "}
                        <Info className="size-5 inline" />
                    </span>{" "}
                    <p className="text-base text-gray-950 mt-2">
                        Fields starting with 'untrack_' will be excluded from
                        showing in categories
                    </p>
                </div>

                <h1 className="my-6 text-lg/8 font-medium tracking-tight text-gray-900">
                    Extra fields
                </h1>
                <div className="bg-gray-100 my-3 px-6 py-2 rounded-md">
                    <h1 className="mt-3 text-sm/8 font-medium tracking-tight text-gray-900">
                        Code Snippet
                    </h1>
                    <CodeSnippet
                        fileName="extrafield.js"
                        codeSnippet={codeSnippets.detailedCode.extraFields}
                        copyFunct={copyCode}
                    >
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
                            {codeSnippets.detailedCode.extraFields}
                        </SyntaxHighlighter>
                    </CodeSnippet>
                </div>

                <div className="bg-gray-100 my-3 px-6 py-2 rounded-md">
                    <h1 className="mt-3 text-sm/8 font-medium tracking-tight text-gray-900">
                        <Info className="size-5 mb-5" />
                    </h1>

                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Field</TableHead>

                                <TableHead>Description</TableHead>

                                <TableHead>Limits</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="min-w-6 p-5">
                                <TableCell>title</TableCell>
                                <TableCell>Category name</TableCell>
                                <TableCell>256 characters</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>description?</TableCell>
                                <TableCell>
                                    Simple message or description of embed
                                </TableCell>
                                <TableCell>4096 characters</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>fields?</TableCell>
                                <TableCell>
                                    Data in key value fields, fields
                                    information,
                                </TableCell>
                                <TableCell>Up to 25 field objects</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>outline?</TableCell>
                                <TableCell>Display inline fields</TableCell>
                                <TableCell>Up to 25 field objects</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <br />
                    <br />
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Field</TableHead>

                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>footer?</TableCell>
                                <TableCell>
                                    embed footer object, footer information
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>code snippet?</TableCell>
                                <TableCell>small code snippet</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>imagebg?</TableCell>
                                <TableCell>
                                    embed image object, image information
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> url?</TableCell>
                                <TableCell>title link url</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>icon_avatar?</TableCell>
                                <TableCell>
                                    embed thumbnail object, thumbnail or avatar
                                    information
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>author?</TableCell>
                                <TableCell>
                                    embed author object, author information
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="bg-gray-100 my-3 px-6 py-2 rounded-md">
                    <h1 className="mt-3 mb-5 text-2xl/8 font-medium tracking-tight text-gray-900">
                        Complete code
                    </h1>

                    <CodeSnippet
                        fileName="complete-code.js"
                        codeSnippet={codeSnippets.detailedCode.complete}
                        copyFunct={copyCode}
                    >
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
                            {codeSnippets.detailedCode.complete}
                        </SyntaxHighlighter>
                    </CodeSnippet>
                </div>
                <p className="text-xs/6 text-brand-700">
                    <Link
                        target="_blank"
                        href="https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline?utm_source=pingforge.com"
                    >
                        Visit Discord page for more knowledge
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default ApiDocs
