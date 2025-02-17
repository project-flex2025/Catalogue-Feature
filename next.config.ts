import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy",
        destination: "http://183.82.7.208:3002/anyapp/search/", // Backend API
      },
      {
        source: "/api/create",
        destination:"http://183.82.7.208:3002/anyapp/create/"
      },
      {
        source: "/api/update",
        destination:"http://183.82.7.208:3002/anyapp/update/"
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
