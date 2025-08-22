/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper output for Vercel
  output: 'standalone',
  
  // Enable static exports if needed
  trailingSlash: true,
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Ensure proper asset handling
  assetPrefix: ''
}

module.exports = nextConfig
