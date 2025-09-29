import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Todo lo que empiece con /api lo enviamos al backend Nest :3001
      { source: '/api/:path*', destination: 'http://localhost:3001/:path*' },
    ];
  },
};

export default nextConfig;
