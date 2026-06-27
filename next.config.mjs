import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

export default withNextra({
  output: 'export',       // 开启纯静态导出
  basePath: '/docs',      // 强行挂载到 /docs 路径
  images: {
    unoptimized: true     // 静态导出必须关闭图片优化
  }
})