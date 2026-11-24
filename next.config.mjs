/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: '/img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
      { source: '/mark/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
    ];
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/lookbook', permanent: false },
      { source: '/field-notes/:slug', destination: '/field-notes', permanent: false },
      { source: '/character', destination: '/designedbykjo', permanent: false },
      { source: '/work/waykon-group', destination: 'https://waykongroup.com', permanent: false },
      { source: '/work/fieldwork', destination: 'https://fieldwork.estate', permanent: false },
      { source: '/work/42-events', destination: 'https://fourtytwo-alpha.vercel.app', permanent: false },
      { source: '/work/designedbykjo', destination: '/designedbykjo', permanent: false },
      { source: '/wardrobe', destination: '/', permanent: false },
    ];
  },
};
export default nextConfig;
