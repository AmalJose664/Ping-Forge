import { CopyIcon } from "lucide-react"

const CodeSnippet = ({
    children,
    copyFunct,
    codeSnippet,
    fileName,
}: {
    children: React.ReactNode
    copyFunct: (str: string) => void
    codeSnippet: string
    fileName: string
}) => {
    return (
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
                        onClick={() => copyFunct(codeSnippet)}
                    />
                    <span className="text-gray-400 text-sm">{fileName}</span>
                </div>
            </div>
            {children}
        </div>
    )
}
export default CodeSnippet
