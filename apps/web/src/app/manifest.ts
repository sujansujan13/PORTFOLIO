import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Sujan Raj Pandey — Full-Stack Developer & Software Engineer",
        short_name: "Sujan Portfolio",
        description:
            "Portfolio of Sujan Raj Pandey, Full-Stack Developer specializing in modern web architecture, Next.js, React, and scalable backend systems.",
        start_url: "/",
        display: "standalone",
        background_color: "#0b1c30",
        theme_color: "#0C34C5",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
            {
                src: "/logo.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "maskable",
            },
        ],
    };
}
