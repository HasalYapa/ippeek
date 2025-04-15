/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during production builds
    ignoreBuildErrors: true,
  },
  // Disable static exports and use server-side rendering
  output: 'standalone',
  // Disable static optimization for pages that use browser APIs
  experimental: {
    // This ensures that pages with client-side features are not statically optimized
    serverComponentsExternalPackages: ['dotted-map', 'leaflet']
  },
};

export default nextConfig;
