import type { MetadataRoute } from "next";


export default function manifest(): MetadataRoute.Manifest {
    return {
        // [PROJECT-CUSTOMIZATION]: Full application name
        name: "Sujan Raj Pandey",
        // [PROJECT-CUSTOMIZATION]: Short title under the home screen icon
        short_name: "Sujan",
        // [PROJECT-CUSTOMIZATION]: PWA description
        description:
            "Portfolio of Sujan Raj Pandey, Software Engineer.",
        start_url: "/",
        display: "standalone",
        // [PROJECT-CUSTOMIZATION]: Splash screen and app launch background color
        background_color: "#09090b",
        // [PROJECT-CUSTOMIZATION]: Mobile browser toolbar color (emerald-500)
        theme_color: "#10b981",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
