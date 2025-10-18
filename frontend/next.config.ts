/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:3001/:path*' }];
  },
};
module.exports = nextConfig;
