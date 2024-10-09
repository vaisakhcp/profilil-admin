/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true, // Disables type-checking during the build process
  },

  // Add the redirects configuration
  async redirects() {
    return [
      {
        source: '/', // Root URL
        destination: '/auth/auth1/login', // Redirect to the login page
        permanent: false, // Set to false for temporary redirects (use true for permanent)
      },
    ];
  },
};

export default nextConfig;
