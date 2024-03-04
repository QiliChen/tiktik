/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['lh3.googleusercontent.com','img.tuxiangyan.com','tiktik-app.oss-cn-shanghai.aliyuncs.com'],
  }
}

module.exports = nextConfig
