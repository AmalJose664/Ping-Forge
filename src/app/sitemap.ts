import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://ping-forge.vercel.app"

    const pages = [
        "/",
        "/sign-in",
        "/sign-up",
        "/dashboard",
        "/dashboard?tutorial=true",
        "/dashboard/api-docs",
        "/dashboard/api-key",
        "/privacy-policy",
        "/help",
    ]

    const lastModified = new Date("2025-06-19")

    return pages.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified,
    }))
}
