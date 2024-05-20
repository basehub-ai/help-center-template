/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'assets.dub.co',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
