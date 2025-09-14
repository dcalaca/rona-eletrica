/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false, // Desabilitar Strict Mode para evitar renderização dupla
  swcMinify: true, // Usar SWC para minificação
}

export default nextConfig
