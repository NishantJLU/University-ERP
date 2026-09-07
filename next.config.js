/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js traces the prisma and public assets into serverless functions
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./prisma/**/*', './public/**/*'],
      '/api/**/*': ['./prisma/**/*', './public/**/*'],
    },
  },
  env: {
    NEXT_PUBLIC_UNIVERSITY_NAME: process.env.NEXT_PUBLIC_UNIVERSITY_NAME || "Jagran Lakecity University",
  },
};

module.exports = nextConfig;
