"use client"
import { Button } from "@/components/ui/button"
import Card from "@/components/ui/customCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import {
    ExternalLink,
    Info,
    Link as LinkSvg,
    MessageCircleQuestion,
} from "lucide-react"
import { Modal } from "@/components/ui/Modal"

const AccountSettings = ({
    discordId: initialDiscordId,
}: {
    discordId: string
}) => {
    const [discordId, setDiscordId] = useState(initialDiscordId)
    const [showTip, setShowTip] = useState(false)
    const { mutate, isPending } = useMutation({
        mutationFn: async (discordId: string) => {
            const res = await client.project.setDiscordId.$post({ discordId })
            return await res.json()
        },
    })
    return (
        <>
            {showTip && (
                <Modal
                    className="p-8"
                    showModal={showTip}
                    setShowModal={setShowTip}
                >
                    <h2 className="text-xl/8 font-medium tracking-tight text-gray-900">
                        Ping<span className="text-blue-700">Forge</span>
                    </h2>
                    <div className="flex justify-center items-start gap-6">
                        <Info className="size-10 mt-2" />{" "}
                        <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
                            Discord notifications can be only received after
                            adding our PingForge App to one of your own server
                            or by joining our server
                        </p>
                    </div>
                </Modal>
            )}
            <Card className="max-w-xl w-full space-y-4">
                <div className="">
                    <Label>Discord ID</Label>
                    <Input
                        className="mt-1"
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        placeholder="Enter your discord ID"
                    />
                </div>
                <p className="mt-2 text-sm/6 to-gray-600">
                    Don't know how to find your Discord ID?{" "}
                    <Link
                        target="_blank"
                        href={
                            "https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS58KNN33AZPCZ1W2F2"
                        }
                        className="text-brand-600 hover:text-brand-500"
                    >
                        Learn how to obtain it here{" "}
                        <ExternalLink className="size-3 inline ml-1" />
                    </Link>
                </p>
                <div className="pt-4">
                    <Button
                        onClick={() => mutate(discordId)}
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : "Update"}
                    </Button>
                </div>
            </Card>
            <div className="mt-4 rounded bg-gray-100 flex flex-col justify-center items-start sm:items-start lg:items-center p-3 sm:p-3 lg:p-6 border w-full sm:w-56 lg:w-[36rem]">
                <p className="text-lg/6 text-gray-600">
                    Enable App in Discord{" "}
                </p>
                <Card className="max-w-xl mt-4 w-full relative">
                    <div
                        onClick={() => setShowTip(true)}
                        className="p-1 rounded-lg cursor-pointer text-red-500 absolute top-4 right-4 text-xl hover:bg-gray-400 transition-all duration-200"
                    >
                        <MessageCircleQuestion className="size-4 text-red-500 animate-pulse" />
                    </div>
                    <div>
                        <Label>Add Discord App</Label>
                        <div className="mt-1 relative">
                            <p className="mt-2 text-sm/6 text-gray-600">
                                Add our Discord App to one of your discord
                                servers.
                            </p>
                            <div className="">
                                <Button className="p-4 mt-2  focus:outline-none focus:ring-2 focus:ring-brand-500">
                                    <LinkSvg className="size-4" />
                                    <Link
                                        target="_blank"
                                        href="https://discord.com/oauth2/authorize?client_id=1381237286859051079&permissions=0&integration_type=0&scope=bot"
                                    >
                                        Add PingForge App
                                        <ExternalLink className="size-3 inline ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
                <p className="mt-3 text-sm/6 text-gray-600 sm:m-auto md:m-auto">
                    or
                </p>
                <Card className="max-w-xl mt-4 w-full relative">
                    <div
                        onClick={() => setShowTip(true)}
                        className="p-1 rounded-lg cursor-pointer text-red-500 absolute top-4 right-4 text-xl hover:bg-gray-400 transition-all duration-200"
                    >
                        <MessageCircleQuestion className="size-4 text-red-500 animate-pulse" />
                    </div>
                    <div>
                        <Label>Join</Label>
                        <div className="mt-1 relative">
                            <p className="mt-2 text-sm/6 text-gray-600">
                                Join to our Discord server to receive updates,
                                notifications and more.
                            </p>
                            <Link
                                target="_blank"
                                className="text-blue-700 underline"
                                href="https://discord.gg/9cY9D4Eq"
                            >
                                Join{" "}
                                <ExternalLink className="size-3 inline ml-1" />
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
export default AccountSettings
