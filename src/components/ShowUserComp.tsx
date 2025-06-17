import { LogOut } from "lucide-react"
import { motion } from "motion/react"
import type { Session } from "next-auth"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
interface ShowUserCompProps {
    data: Session | null
    closeFn?: Dispatch<SetStateAction<boolean>>
}
const ShowUserComp = ({ data, closeFn }: ShowUserCompProps) => {
    const userCompRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                userCompRef.current &&
                !userCompRef.current.contains(event.target as Node)
            ) {
                closeFn && closeFn(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            closeFn && closeFn(false)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [closeFn])
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: -50, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            exit={{ y: -100, opacity: 0 }}
            ref={userCompRef}
            className="absolute z-[5000] top-[-70px] left-0 shadow-md py-4 px-5 bg-gray-100 border rounded-md border-gray-800"
        >
            <div className="flex flex-col rounded-md items-center justify-between gap-1">
                <div className="flex items-center justify-between gap-4">
                    <img
                        src={data?.user?.image || ""}
                        className="h-9  w-9 rounded object-cover"
                        alt="User Image"
                    />
                    <div>
                        <h3 className="my-2">{data?.user?.email}</h3>
                        <h3 className="my-2">{data?.user?.name}</h3>
                    </div>
                </div>
                <div className="cursor-pointer">
                    <Button variant={"outline"} onClick={() => signOut()}>
                        {" "}
                        <LogOut className="size-4 inline mr-4" />
                        sign out
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
export default ShowUserComp
