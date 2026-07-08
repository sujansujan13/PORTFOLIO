import "@my-portfolio/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // port:"" -> This means "only allow the default ports for this protocol."
        port: "",
        //pathname: "/**", -> This is a wildcard match that means "allow any folder, sub-folder, and file path on this domain."
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
