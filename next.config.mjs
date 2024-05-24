/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'basehub.earth',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
