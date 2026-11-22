import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

/**
 * Dynamic Twitter (X) Summary Large Image Card Generator
 * Automatically serves a dedicated image endpoint and injects <meta name="twitter:image">.
 */

// Image Metadata
export const alt = "Sujan Raj Pandey — Portfolio & Engineering Showcase";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function TwitterImage() {
    let logoSrc = "";
    try {
        const logoData = await readFile(new URL("../../public/logo.svg", import.meta.url));
        logoSrc = `data:image/svg+xml;base64,${logoData.toString("base64")}`;
    } catch (e) {
        console.error("Failed to load logo for Twitter image:", e);
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
                        Full-Stack Architect
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
                        Designing the Digital Future with Code
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
                        Bridging the gap between elegant UI design and robust backend architecture. Full-Stack Developer specializing in Next.js, Node.js & Cloud engineering.
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
                        "Microservices",
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
