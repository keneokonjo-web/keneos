/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
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
