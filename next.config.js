/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design/icons', '@ant-design/nextjs-registry', 'rc-util', 'rc-pagination', 'rc-picker', 'rc-tree', 'rc-table'],
};

module.exports = nextConfig;
