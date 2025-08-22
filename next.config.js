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
  assetPrefix: '',
  
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig
