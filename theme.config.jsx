export default {
  logo: <strong>CalculatorX 帮助中心</strong>,
  project: {
    link: 'https://github.com/StarHeartY/CalcX-docs' // 右上角的 GitHub 图标链接
  },
  docsRepositoryBase: 'https://github.com/StarHeartY/CalcX-docs/tree/main', // 用于“编辑此页”功能

  useNextSeoProps() {
    return {
      titleTemplate: '%s – CalculatorX 帮助中心' // %s 会自动替换为当前页面的名字
    }
  },

  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/docs/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/docs/favicon.png" />
    </>
  ),

  footer: {
    text: '© 2026 CalculatorX Project'
  },
  // 强制全站默认主题色跟随系统，不闪烁
  nextThemes: {
    defaultTheme: 'system'
  }
}