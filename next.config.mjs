/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'basehub.earth',
        protocol: 'https',
      },
      {
        hostname: 'assets.basehub.com',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
