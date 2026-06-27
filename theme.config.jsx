import { useConfig } from 'nextra-theme-docs'

export default {
  logo: <strong>CalculatorX 帮助中心</strong>,
  project: {
    link: 'https://github.com/StarHeartY/CalcX-docs'
  },

  // 版权声明
  footer: {
    content: (
      <span>
        Copyright © {(() => {
          const start = 2026
          const now = new Date().getFullYear()
          return start === now ? now : `${start}–${now}`
        })()} <a href="https://calcx.startyi.com" target="_blank" rel="noopener noreferrer">CalculatorX</a>.
        All Rights Reserved.
      </span>
    )
  },

  // 关闭右侧的 "Edit this page"
  editLink: {
    component: () => null
  },
  // 反馈链接改为中文
  feedback: {
    content: '有疑问？反馈 →'
  },

  // 将 "Last updated on" 改为中文
  gitTimestamp: function GitTimestamp({ timestamp }) {
    return (
      <>
        最后更新于{' '}
        <time dateTime={timestamp.toISOString()}>
          {timestamp.toLocaleDateString('zh-CN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </time>
      </>
    )
  },

  // 用函数形式以获取当前页面的动态标题
  head: function useHead() {
    const { frontMatter, title: pageTitle } = useConfig()
    const title = pageTitle
      ? `${pageTitle} - CalculatorX 帮助中心`
      : 'CalculatorX 帮助中心'

    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {frontMatter.description && (
          <>
            <meta name="description" content={frontMatter.description} />
            <meta property="og:description" content={frontMatter.description} />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/docs/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/docs/favicon.png" />
      </>
    )
  },

  // 强制全站默认主题色跟随系统，不闪烁
  nextThemes: {
    defaultTheme: 'system'
  }
}
