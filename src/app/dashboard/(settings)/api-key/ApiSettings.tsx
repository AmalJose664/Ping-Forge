"use client"
import { Button } from "@/components/ui/button"
import Card from "@/components/ui/customCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const ApiSettings = ({ apiKey }: { apiKey: string }) => {
    const [copySuccess, setCopySuccess] = useState(false)

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey)
        setCopySuccess(true)

        timerRef.current = setTimeout(() => {
            setCopySuccess(false)
        }, 2000)
    }
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])
    return (
        <>
            <Card className="max-w-xl w-full">
                <motion.div
                    initial={{ y: -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        duration: 0.3,
                        delay: 0.1,
                        ease: "backInOut",
                    }}
                >
                    <Label>Your API Key</Label>
                    <div className="mt-1 relative">
                        <Input
                            className=""
                            readOnly
                            value={apiKey}
                            type="password"
                        ></Input>
                        <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
                            <Button
                                variant="ghost"
                                onClick={copyApiKey}
                                className="p-1 w-10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                {copySuccess ? (
                                    <CheckIcon className="size-4 text-brand-900" />
                                ) : (
                                    <ClipboardIcon className="size-4 text-brand-900" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="mt-2 text-sm/6 text-gray-600">
                        Keep your key secret and do not share it with others.
                    </p>
                </motion.div>
            </Card>
        </>
    )
}
export default ApiSettings
