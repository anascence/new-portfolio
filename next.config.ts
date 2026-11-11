import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // minimal server bundle for the Docker image
  // The old standalone pages now live as sections of the home page.
  async redirects() {
    return [
      { source: "/projects", destination: "/#work", permanent: false },
      { source: "/skills", destination: "/#stack", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
