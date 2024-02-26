/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['i.kfs.io','lh3.googleusercontent.com'],
  }
}

module.exports = nextConfig
