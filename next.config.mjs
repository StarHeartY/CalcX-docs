import nextra from 'nextra'
import React from 'react'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true
})

export default withNextra({
  basePath: '/docs',
  output: 'export',
  images: {
    unoptimized: true
  }
})