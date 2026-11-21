import { ImageResponse } from "next/og";

/**
 * Dynamic Open Graph (OG) Image Generator
 * Generates dynamic 1200x630 social share preview images for LinkedIn, Facebook, Slack, Discord.
 *
 * [PROJECT-CUSTOMIZATION]:
 * 1. `alt`: Update the image accessible description for your application.
 * 2. `brandBadge`: Change "EX" to your brand abbreviation or logo icon.
 * 3. `brandName`: Update to your product or company name.
 * 4. `tagline`: Update the headline and subtitle to pitch your specific product.
 * 5. `pills`: Adjust the feature badges (e.g. your tech stack or key product benefits).
 */

// Image Metadata
export const alt = "Sujan Raj Pandey's Portfolio";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#09090b", // zinc-950
                    backgroundImage:
                        "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 40%)",
                    backgroundSize: "50px 50px, 100% 100%",
                    padding: "70px 80px",
                    color: "#fafafa",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                }}
            >
                {/* Top Header: Brand Pill & Version Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {/* [PROJECT-CUSTOMIZATION]: Brand Logo Box */}
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "14px",
                                backgroundColor: "rgba(16, 185, 129, 0.15)",
                                border: "1.5px solid rgba(16, 185, 129, 0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#34d399",
                                fontSize: "22px",
                                fontWeight: 800,
                                fontFamily: "monospace",
                            }}
                        >
                            EX
                        </div>
                        {/* [PROJECT-CUSTOMIZATION]: Project Title */}
                        <span
                            style={{
                                fontSize: "26px",
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                color: "#e4e4e7",
                            }}
                        >
                            express-mongo-next-starter
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 16px",
                            borderRadius: "9999px",
                            backgroundColor: "rgba(24, 24, 27, 0.8)",
                            border: "1px solid rgba(63, 63, 70, 0.6)",
                            fontSize: "14px",
                            color: "#a1a1aa",
                            fontFamily: "monospace",
                        }}
                    >
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "9999px",
                                backgroundColor: "#10b981",
                            }}
                        />
                        Production-Ready
                    </div>
                </div>

                {/* Center: Main Headline & Pitch */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* [PROJECT-CUSTOMIZATION]: Hero Pitch Title */}
                    <h1
                        style={{
                            fontSize: "58px",
                            fontWeight: 900,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            margin: 0,
                            color: "#ffffff",
                        }}
                    >
                        Enterprise Authentication & Session Infrastructure
                    </h1>
                    {/* [PROJECT-CUSTOMIZATION]: Descriptive Subtitle */}
                    <p
                        style={{
                            fontSize: "22px",
                            color: "#a1a1aa",
                            lineHeight: 1.4,
                            margin: 0,
                            maxWidth: "920px",
                        }}
                    >
                        Full-stack template with Express 5, Next.js 16 App Router, dual local/Cloudinary asset storage, and multi-device session security.
                    </p>
                </div>

                {/* Bottom Footer: Feature Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {/* [PROJECT-CUSTOMIZATION]: Highlighted Feature Pills */}
                    {[
                        "Next.js 16 (Turbopack)",
                        "Express 5 & MongoDB",
                        "In-Memory JWT + HTTP-Only Cookie",
                        "Multi-Device Sessions",
                        "RBAC Admin Panel",
                    ].map((pill) => (
                        <div
                            key={pill}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px 18px",
                                borderRadius: "12px",
                                backgroundColor: "rgba(24, 24, 27, 0.6)",
                                border: "1px solid rgba(63, 63, 70, 0.5)",
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#d4d4d8",
                            }}
                        >
                            {pill}
                        </div>
                    ))}
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
