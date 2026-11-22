import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
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
export const alt = "Sujan Raj Pandey — Full-Stack Developer & Software Architect Portfolio";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
    let logoSrc = "";
    try {
        const logoData = await readFile(new URL("../../public/logo.svg", import.meta.url));
        logoSrc = `data:image/svg+xml;base64,${logoData.toString("base64")}`;
    } catch (e) {
        console.error("Failed to load logo for OG image:", e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#0b1c30",
                    backgroundImage:
                        "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.04) 2%, transparent 0%), radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.18) 0%, transparent 45%)",
                    backgroundSize: "50px 50px, 100% 100%",
                    padding: "70px 80px",
                    color: "#f8f9ff",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                }}
            >
                {/* Top Header: Brand Pill & Availability Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {logoSrc ? (
                            <img
                                src={logoSrc}
                                alt="Logo"
                                width="48"
                                height="48"
                                style={{ borderRadius: "50%", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                            />
                        ) : null}
                        <span
                            style={{
                                fontSize: "26px",
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                color: "#f8f9ff",
                            }}
                        >
                            Sujan Raj Pandey
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 16px",
                            borderRadius: "9999px",
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            fontSize: "14px",
                            color: "#93c5fd",
                            fontWeight: 600,
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
                        Available for Work
                    </div>
                </div>

                {/* Center: Main Headline & Pitch */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h1
                        style={{
                            fontSize: "56px",
                            fontWeight: 900,
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                            margin: 0,
                            color: "#ffffff",
                        }}
                    >
                        Full-Stack Developer & Software Architect
                    </h1>
                    <p
                        style={{
                            fontSize: "22px",
                            color: "#94a3b8",
                            lineHeight: 1.4,
                            margin: 0,
                            maxWidth: "920px",
                        }}
                    >
                        Crafting high-performance web platforms, elegant user interfaces, and resilient backend systems with modern technologies.
                    </p>
                </div>

                {/* Bottom Footer: Feature Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {[
                        "React & Next.js",
                        "TypeScript",
                        "Node & Express",
                        "MongoDB & SQL",
                        "AWS & CI/CD",
                        "REST & tRPC",
                    ].map((pill) => (
                        <div
                            key={pill}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px 18px",
                                borderRadius: "12px",
                                backgroundColor: "rgba(15, 23, 42, 0.6)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#cbd5e1",
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
