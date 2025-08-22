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
  assetPrefix: ''
}

module.exports = nextConfig
