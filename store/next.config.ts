import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "iicdjmyexysxzflnroil.supabase.co",
      },
    ],
  },
  allowedDevOrigins: ["192.168.31.105"],
};

export default nextConfig;
