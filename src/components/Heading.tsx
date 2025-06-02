import { cn } from "@/utils"
import { HTMLAttributes, ReactNode } from "react"

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode
    className?: string
}
const Heading = ({ children, className, ...props }: HeadingProps) => {
    return (
        <h1
            className={cn(
                "text-4xl sm:text-5xl text-pretty font-heading font-semibold tracking-tight text-zinc-800",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    )
}
export default Heading
