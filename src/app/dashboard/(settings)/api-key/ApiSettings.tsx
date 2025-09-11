"use client"
import { Button } from "@/components/ui/button"
import Card from "@/components/ui/customCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const ApiSettings = ({ apiKey }: { apiKey: string }) => {
	const [apiKeyState, setApiKeyState] = useState(apiKey)
    const [copySuccess, setCopySuccess] = useState(false)
	const { mutate, isPending, isError } = useMutation({
			mutationKey: ["new_apikey"],
			mutationFn: async () => {
				const res = await client.project.resetApiKey.$post()
				return  res
			},
			onSuccess: (data) => {
    		
			data.json().then((d)=>{
				setApiKeyState(d.key)
			})
  			},
		})
	
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)


    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKeyState)
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
	const hiddenApiKey = apiKeyState.slice(0,10) + "............"+apiKeyState.slice(25)
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
                    <Label>Your API Key</Label> {isError && <p className="text-red-500 text-sm">Some error Occured</p> } 
                    <div className="mt-1 relative ">
                        <Input
                            className="api-text-box"
                            readOnly
                            value={isPending ? "-----------------------------------------":hiddenApiKey}
                            type="text"

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
                    <div className="flex justify-between">
						<p className="mt-2 text-sm/6 text-gray-600">
                        Keep your key secret and do not share it with others.
                    </p>
					<Button
                                variant="default"
                                onClick={()=>mutate()}
                                className="p-1 focus:outline-none focus:ring-2 mt-4 focus:ring-brand-500 float-end"
                            >
                               Reset Api Key
                            </Button>
					</div>
                </motion.div>
            </Card>
        </>
    )
}
export default ApiSettings
