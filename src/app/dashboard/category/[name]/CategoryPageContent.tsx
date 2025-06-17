"use client"

import { Event, EventCategory } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import EmptyCategoryState from "./EmptyCategoryState"
import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { client } from "@/lib/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Card from "@/components/ui/customCard"
import { ArrowUpDown, BarChart } from "lucide-react"
import { isAfter, isToday, startOfWeek } from "date-fns"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils"
import Heading from "@/components/Heading"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { motion } from "motion/react"

interface CategoryPageContentProps {
    hasEvents: boolean
    category: EventCategory
}
const CategoryPageContent = ({
    hasEvents: initialHasEvents,
    category,
}: CategoryPageContentProps) => {
    const searchParams = useSearchParams()

    const [activeTab, setActiveTab] = useState<"today" | "week" | "month">(
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

    const { data, isFetching } = useQuery({
        queryKey: [
            "events",
            category.name,
            pagination.pageIndex,
            pagination.pageSize,
            activeTab,
        ],
        queryFn: async () => {
            const res = await client.category.getEventsByCategoryName.$get({
                name: category.name,
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                timeRange: activeTab,
            })
            return await res.json()
        },
        refetchOnWindowFocus: false,
        enabled: pollingData.hasEvents,
    })

    const columns: ColumnDef<Event>[] = useMemo(() => {
        return [
            {
                accessorKey: "category",
                header: "Category",
                cell: () => <span>{category.name || "Uncategorised"}</span>,
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Date <ArrowUpDown className="size-4 ml-2" />
                    </Button>
                ),
                cell: ({ row }) => {
                    return new Date(row.getValue("createdAt")).toLocaleString()
                },
            },

            ...(data?.events[0]
                ? Object.keys(data.events[0].fields as object)
                      .filter((field) => !field.startsWith("untrack"))
                      .map((field) => ({
                          accesorFn: (row: Event) =>
                              (row.fields as Record<string, any>)[field],
                          header: field,
                          cell: ({ row }: { row: Row<Event> }) =>
                              (row.original.fields as Record<string, any>)[
                                  field
                              ] || "-",
                      }))
                : []),

            {
                accessorKey: "deliveryStatus",
                header: "Delivery Status",
                cell: ({ row }) => (
                    <span
                        className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            {
                                "bg-green-100 text-green-800":
                                    row.getValue("deliveryStatus") ===
                                    "DELIVERED",
                                "bg-red-100 text-red-800":
                                    row.getValue("deliveryStatus") === "FAILED",
                                "bg-yellow-100 text-yellow-800":
                                    row.getValue("deliveryStatus") === "FAILED",
                            }
                        )}
                    >
                        {row.getValue("deliveryStatus")}
                    </span>
                ),
            },
        ]
    }, [category.name, data?.events])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: data?.events || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.eventsCount || 0) / pagination.pageSize),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })
    const numericFieldSums = useMemo(() => {
        if (!data?.events || data.events.length === 0) return {}

        const sums: Record<
            string,
            {
                total: number
                thisWeek: number
                thisMonth: number
                today: number
            }
        > = {}
        const now = new Date()
        const weekStart = startOfWeek(now, { weekStartsOn: 0 })
        const monthStart = startOfWeek(now)

        data.events.forEach((event) => {
            const eventDate = event.createdAt
            Object.entries(event.fields as object).forEach(([field, value]) => {
                if (typeof value === "number") {
                    if (!sums[field]) {
                        sums[field] = {
                            total: 0,
                            thisWeek: 0,
                            thisMonth: 0,
                            today: 0,
                        }
                    }
                    sums[field].total += value

                    if (
                        isAfter(eventDate, weekStart) ||
                        eventDate.getTime() === weekStart.getTime()
                    ) {
                        sums[field].thisWeek += value
                    }
                    if (
                        isAfter(eventDate, monthStart) ||
                        eventDate.getTime() === monthStart.getTime()
                    ) {
                        sums[field].thisMonth += value
                    }
                    if (isToday(eventDate)) {
                        sums[field].today += value
                    }
                }
            })
        })
        return sums
    }, [data?.events])

    const TotalFields = () => {
        return (
            <Card>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm/6 font-medium">Unique Fields</p>
                    <BarChart className="size-4 text-muted-foreground" />
                </div>
                <motion.div
                    initial={{ y: -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        duration: 0.3,
                        delay: 0.1,
                        ease: "backInOut",
                    }}
                >
                    <p className="text-2xl font-bold"></p>
                    <p className="text-xs/5 text-muted-foreground">
                        {activeTab === "today"
                            ? "today"
                            : activeTab === "week"
                            ? "this week"
                            : "this month"}
                    </p>
                    <ul>
                        {data?.uniqueFields.map((item: any, key) => {
                            return (
                                <li
                                    key={key}
                                    className="flex flex-col gap-2 items-start justify-center"
                                >
                                    <div>{item}</div>
                                </li>
                            )
                        })}
                    </ul>
                </motion.div>
            </Card>
        )
    }

    const NumericFieldSumCards = () => {
        if (Object.keys(numericFieldSums).length === 0) return null
        return Object.entries(numericFieldSums).map(([field, sums]) => {
            const releventSums =
                activeTab === "today"
                    ? sums.today
                    : activeTab === "week"
                    ? sums.thisWeek
                    : sums.thisMonth

            return (
                <>
                    <Card key={field}>
                        <motion.div
                            initial={{ y: -15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.1,
                                ease: "backInOut",
                            }}
                            className="flex flex-row items-center justify-between space-y-0"
                        >
                            <p className="text-sm/6 font-medium">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </p>
                            <BarChart className="size-4 text-muted-foreground" />
                        </motion.div>
                        <p className="text-xs/8">Total Value</p>
                        <div>
                            <p className="text-2xl font-bold">{releventSums}</p>
                            <p className="text-xs/5 text-muted-foreground">
                                {activeTab === "today"
                                    ? "today"
                                    : activeTab === "week"
                                    ? "this week"
                                    : "this month"}
                            </p>
                        </div>
                    </Card>
                </>
            )
        })
    }

    if (!pollingData.hasEvents) {
        return <EmptyCategoryState categoryName={category.name} />
    }
    return (
        <div className="space-y-6">
            <Tabs
                value={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as "today" | "week" | "month")
                }
            >
                <TabsList className="mb-2">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                    <motion.div
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.3,
                            delay: 0.2,
                            ease: "backInOut",
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                    >
                        <Card className="border-2 border-brand-700">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <p className="text-sm/6 font-medium">
                                    Total Events
                                </p>
                                <BarChart className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {data?.eventsCount || 0}
                                </p>
                                <p className="text-xs/5 text-muted-foreground">
                                    Events{" "}
                                    {activeTab === "today"
                                        ? "today"
                                        : activeTab === "week"
                                        ? "this week"
                                        : "this month"}
                                </p>
                            </div>
                        </Card>
                        {data?.uniqueFields &&
                            data?.uniqueFields.length > 0 && <TotalFields />}
                        <NumericFieldSumCards />
                    </motion.div>
                </TabsContent>
            </Tabs>

            <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "backInOut" }}
                className="flex flex-col gap-4"
            >
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.3,
                            delay: 0.4,
                            ease: "backInOut",
                        }}
                        className="w-full flex gap-4 flex-col"
                    >
                        <Heading className="text-3xl">Event Overview</Heading>
                    </motion.div>
                </div>

                <Card contentClassName="px-6 py-4">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {!header.isPlaceholder &&
                                                flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                [...Array(5)].map((_, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((_, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No Results
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </motion.div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage() || isFetching}
                >
                    {isFetching ? "..." : "Prev"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage() || isFetching}
                >
                    {isFetching ? "..." : "Next"}
                </Button>
            </div>
        </div>
    )
}
export default CategoryPageContent
