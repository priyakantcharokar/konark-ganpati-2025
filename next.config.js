/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Vercel compatibility
  // output: 'standalone', // This was causing the routing issue
  
  // Enable static exports if needed
  trailingSlash: false,
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Ensure proper asset handling
  assetPrefix: '',
  
  // Disable all caching for API routes to ensure fresh data
  // Note: Removed experimental.staticPageGenerationTimeout as it's not valid in Next.js 14
  
  // Disable caching for all API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, private, no-transform',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
          {
            key: 'X-Accel-Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
