/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'img.tuxiangyan.com',
      'tiktik-app.oss-cn-shanghai.aliyuncs.com',
    ],
  },
  // 导入并使用 i18n 配置
  i18n: require('./next-i18next.config').i18n,
};

module.exports = nextConfig;