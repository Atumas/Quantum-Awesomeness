/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['jszip', 'netlify']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.huggingface.co']
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true
};

module.exports = nextConfig;
