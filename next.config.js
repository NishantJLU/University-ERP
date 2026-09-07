/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js traces the prisma directory and database into serverless functions
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./prisma/**/*"],
    },
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
    NEXT_PUBLIC_UNIVERSITY_NAME: process.env.NEXT_PUBLIC_UNIVERSITY_NAME || "Jagran Lakecity University",
  },
};

module.exports = nextConfig;
