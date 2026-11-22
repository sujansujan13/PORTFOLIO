import type { MetadataRoute } from "next";

/**
 * Production Search Engine Crawler Directives (RFC 9309)
 * Automatically serves /robots.txt from the Next.js App Router.
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sujanrajpandey.com.np";

    return {
        rules: [
            {
                userAgent: "*",
                // Allow all public pages (/about, /projects, /experience, /blog, /contact, etc.)
                allow: "/",
                // Disallow private admin dashboard, internal API endpoints, and login screen
                disallow: [
                    "/dashboard",
                    "/dashboard/",
                    "/dashboard/*",
                    "/api/",
                    "/api/*",
                    "/login",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
