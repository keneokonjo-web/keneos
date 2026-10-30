/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/character', destination: '/designedbykjo', permanent: false },
      { source: '/wardrobe', destination: '/', permanent: false },
    ];
  },
};
export default nextConfig;
