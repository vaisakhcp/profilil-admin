/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

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
