import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "syargizgydjegwtwzwab.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  basePath: "/admin",
  assetPrefix: "/admin",
};

export default nextConfig;
