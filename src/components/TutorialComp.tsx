"use client"

import { useEffect, useRef, useState } from "react"
import { Modal } from "./ui/Modal"
import {
    ArrowLeft,
    ArrowRight,
    CopyIcon,
    ExternalLink,
    PlusIcon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { motion } from "motion/react"

const TutorialComp = () => {
    const [showTuto, setShowTuto] = useState(true)
    const [tutoState, setTutoState] = useState(0)
    const router = useRouter()
    const closeTab = (str: string) => {
        router.push("/dashboard?" + str + "=true")
        setShowTuto(false)
    }
    const modalClose = () => {
        router.push("/dashboard")
        setShowTuto(false)
    }
    const tutoPages = [
        <FirstTab key={1} />,
        <SecondTab key={2} closeTab={closeTab} />,
        <ThirdTab key={3} />,
        <FourthTab key={4} />,
    ]

    return (
        <div>
            <Modal
                className="p-8 relative"
                showModal={showTuto}
                setShowModal={modalClose}
            >
                <div>
                    <div className="absolute bg-brand-600 top-14 rounded-full left-[48%] pt-1 w-8 h-8 text-center text-white">
                        {tutoState + 1}
                    </div>
                    <h2 className="text-xl/8 font-medium tracking-tight text-gray-900">
                        Ping<span className="text-blue-700">Forge</span>
                    </h2>
                    <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
                        Quick Help
                    </p>

                    <div className="relative ">
                        {tutoState > 0 && (
                            <div
                                className="absolute hover:bg-gray-200 transition-all duration-300 rounded-lg left-0 top-[50%]"
                                onClick={() =>
                                    setTutoState((prev) =>
                                        prev > 0 ? prev - 1 : prev
                                    )
                                }
                            >
                                <ArrowLeft className="size-5" />
                            </div>
                        )}
                        {tutoState < tutoPages.length - 1 && (
                            <div
                                className="absolute hover:bg-gray-200 rounded-lg right-0 top-[50%] transition-all duration-300"
                                onClick={() =>
                                    setTutoState((prev) =>
                                        prev < tutoPages.length - 1
                                            ? prev + 1
                                            : prev
                                    )
                                }
                            >
                                <ArrowRight className="size-5" />
                            </div>
                        )}
                        <div className="p-4 rounded bg-gray-50 ">
                            {tutoPages[tutoState]}
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-center gap-2 mt-4">
                        {tutoPages.map((_, index) => (
                            <span
                                key={index}
                                className={`rounded ${
                                    tutoState == index
                                        ? "bg-gray-700"
                                        : "bg-gray-300"
                                } w-1 h-1`}
                            ></span>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default TutorialComp

function FirstTab() {
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold ">Update ID</h2>
            <p className="text-sm/6 mt-2 text-gray-600">
                Update Discord ID in settings
            </p>
            <div className="flex flex-col mt-4">
                <div className="flex gap-2 mt-2">
                    &gt;
                    <p className="text-sm/6 text-gray-600 max-w-prose ">
                        Account-settings &#11106; Discord ID
                    </p>
                </div>

                <div className="flex gap-2">
                    &gt;
                    <p className="text-sm/6 text-gray-600 max-w-prose ">
                        Update your Discord ID
                    </p>
                </div>

                <div className="flex gap-2">
                    &bull;
                    <p className="text-sm/6 text-gray-600 max-w-prose ">
                        Dont have a Discord Account. Create one{" "}
                        <Link
                            href="https://discord.com/register"
                            target="_blank"
                            className="underline text-brand-600"
                        >
                            here
                            <ExternalLink className="size-3 inline ml-1" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
function SecondTab({ closeTab }: { closeTab: (str: string) => void }) {
    return (
        <div className="flex flex-col justify-center  items-center">
            <h2 className="text-2xl font-semibold mb-6">Categories</h2>
            <Button
                onClick={() => closeTab("addcategory")}
                className="w-full sm:w-fit"
            >
                <PlusIcon className="size-4 mr-2" />
                Add Category
            </Button>

            <div className=" flex flex-col">
                <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
                    Add new Category
                </p>
            </div>
        </div>
    )
}

function ThirdTab() {
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold mb-6">Discord Server</h2>
            <img
                src="/discord-settings.png"
                style={{ height: "200px", width: "auto" }}
                alt="Discord"
                className="rounded-md"
            />
            <p className="text-base/6 text-gray-600 max-w-prose mt-2 mb-3">
                Add our discord app to one of your servers. Add by visiting{" "}
                <Link
                    className="underline text-brand-600"
                    target="_blank"
                    href="https://discord.com/oauth2/authorize?client_id=1381237286859051079&permissions=0&integration_type=0&scope=bot"
                >
                    here
                    <ExternalLink className="size-3 inline ml-1" />
                </Link>
            </p>
            <p className="mb-3">
                <span className="flex gap-6 text-gray-700">
                    <span className="p-1 text-center rounded bg-brand-500">
                        https://discord.com/o...
                    </span>
                    <span>&#11106;</span>
                    <span className="p-1 text-center rounded bg-brand-500">
                        Add server
                    </span>
                    <span>&#11106;</span>
                    <span className="p-1 text-center rounded bg-brand-500">
                        Authorize
                    </span>
                </span>
            </p>
            <p className="text-sm/6 text-gray-600 max-w-prose ">or</p>
            <p className="text-base/6 text-gray-600 max-w-prose mt-2 ">
                Join to{" "}
                <Link
                    className="underline text-brand-600"
                    href="https://discord.gg/9cY9D4Eq"
                    target="_blank"
                >
                    our Discord server{" "}
                    <ExternalLink className="size-3 inline ml-1" />
                </Link>{" "}
                to receive DM notifications and updates and more !!
            </p>
        </div>
    )
}

function FourthTab() {
    const codeSnippet = `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
    category: '<valid category name>',
	description: "",
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [copy, setCopy] = useState(false)
    const copyCode = () => {
        setCopy(true)
        navigator.clipboard.writeText(codeSnippet)
        timerRef.current = setTimeout(() => setCopy(false), 1500)
    }
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl/8 tracking-tight font-medium text-center text-gray-950 mb-8">
                Sending Request
            </h2>

            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <div className="size-3 rounded-full bg-yellow-500" />
                        <div className="size-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex gap-3 items-center relative">
                        {copy && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="p-2 absolute rounded-lg bg-gray-300 text-gray-700"
                            >
                                Copied
                            </motion.div>
                        )}
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
            <p className="text-sm text-gray-900 mb-8 max-w-md mt-4 text-pretty text-center">
                Send a simple request to our API
            </p>
        </div>
    )
}
