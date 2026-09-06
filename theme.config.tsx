import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

export default {
  logo: <strong>CalculatorX 帮助中心</strong>,
  project: {
    link: 'https://github.com/StarHeartY/CalcX-docs'
  },

  // 顶部导航：原生 <a> 链接到主站首页，避免被 Next 的 basePath 改写到 /docs
  navbar: {
    extraContent: (
      <a
        href="/"
        className="_text-sm _text-gray-600 hover:_text-gray-800 dark:_text-gray-400 dark:hover:_text-gray-200"
      >
        主页
      </a>
    )
  },

  // 页脚：左侧版权与备案信息，右侧法律文档链接
  footer: {
    content: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', width: '100%', fontSize: '14px', lineHeight: 2.5, opacity: 0.8 }}>
        <div>
          {/* TODO: ICP 备案审核通过后，在此添加备案号一行（须链接至 https://beian.miit.gov.cn/），
              仅在 calcx.startyi.cn 显示 */}
          <div>
            版权所有 © {(() => {
              const start = 2026
              const now = new Date().getFullYear()
              return start === now ? now : `${start}–${now}`
            })()} <a href="/">StartYi</a>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <a href="/agreement/">用户协议</a>
          <a href="/privacy/">隐私政策</a>
        </div>
      </div>
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

  // 搜索框中文化
  search: {
    placeholder: '搜索…',
    loading: '正在加载…',
    error: '搜索索引加载失败。',
    emptyResult: (
      <span className="_block _select-none _p-8 _text-center _text-sm _text-gray-400">
        未找到相关结果
      </span>
    )
  },

  // 主题切换选项中文化
  themeSwitch: {
    useOptions: {
      light: '浅色',
      dark: '深色',
      system: '跟随系统'
    }
  },

  // 右侧本页目录中文化
  toc: {
    title: '本页目录',
    backToTop: '返回顶部'
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
    const { pathname, basePath } = useRouter()
    // 当前文档使用静态路由，pathname 不包含查询参数和片段。
    const canonicalUrl = pathname === '/404' || pathname === '/_error'
      ? null
      : `https://calcx.startyi.com${basePath}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`
    const title = pageTitle
      ? `${pageTitle} - CalculatorX 帮助中心`
      : 'CalculatorX 帮助中心'

    return (
      <>
        <title>{title}</title>
        {canonicalUrl && <link key="canonical" rel="canonical" href={canonicalUrl} />}
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
