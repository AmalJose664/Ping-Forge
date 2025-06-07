"use client"

import { EventCategory } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import EmptyCategoryState from "./EmptyCategoryState"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

interface CategoryPageContentProps {
    hasEvents: boolean
    category: EventCategory
}
const CategoryPageContent = ({
    hasEvents: initialHasEvents,
    category,
}: CategoryPageContentProps) => {
    const searchParams = useSearchParams()

    const [activeTab, setActiveTab] = useState<"today" | "week" | "monthly">(
        "today"
    )
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "30", 10)

    const [pagination, setPagination] = useState({
        pageIndex: page - 1,
        pageSize: limit,
    })
    const { data: pollingData } = useQuery({
        queryKey: ["category", category.name, "hasEvents"],
        initialData: { hasEvents: initialHasEvents },
    })
    if (!pollingData.hasEvents) {
        return <EmptyCategoryState categoryName={category.name} />
    }
    const {} = useQuery({
        queryKey: [
            "events",
            category.name,
            pagination.pageIndex,
            pagination.pageSize,
        ],
    })
    return <div></div>
}
export default CategoryPageContent
