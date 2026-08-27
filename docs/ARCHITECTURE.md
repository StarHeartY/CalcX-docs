# 架构说明

CalcX-docs 是 CalculatorX 的中文帮助中心源码仓库。项目使用 Next.js Pages Router 和 Nextra 将 `pages/` 中的 Markdown/MDX 内容导出为纯静态站点，同一份最终产物既可部署到 Cloudflare Pages，也可交付给 CalculatorX 项目作为离线帮助资源。

## 系统边界

本仓库负责：

- 用户手册页面、导航、主题和静态资源；
- 本地开发与静态构建；
- 构建产物的目录重组和图片转换；
- Cloudflare Pages 所需的 `out/docs/` 发布产物。

本仓库不负责：

- CalculatorX 应用功能的实现与版本发布；
- CalculatorX 客户端加载 `rawfile/docs` 的内部逻辑；
- Cloudflare Worker 的独立部署和账号级配置；
- 服务器端 API、数据库或动态渲染。

## 构建与访问链路

```text
pages/*.md(x) ─┐
components/* ──┼─> Next.js + Nextra ─> Next.js 静态导出
public/* ──────┘                              │
                                             ▼
                                      out/（临时扁平产物）
                                             │
                                      postbuild.mjs
                                目录重组 + 图片转 WebP
                                             │
                                             ▼
                                   out/docs/（唯一产物）
                                      │              │
                                      │              └─> CalculatorX
                                      │                  rawfile/docs
                                      ▼
                              Cloudflare Pages
                         calcx-docs.pages.dev/docs/*
                                      ▲
                                      │ 保留路径，仅替换主机名
                                      │
                           Worker: calcx-docs-proxy
                                      ▲
                                      │
                         calcx.startyi.com/docs*
```

## 内容层

Nextra 把 `pages/` 视为文档路由源：

- `.md` 适合纯 Markdown 页面；
- `.mdx` 允许导入 React/Nextra 组件；
- `_meta.js` 定义同级页面的名称、顺序和导航行为；
- `theme.config.tsx` 定义站点标题、搜索、主题、页脚和页面元信息；
- `styles/global.css` 提供全站及自定义组件样式。

页面内容是 CalculatorX 用户手册，不是工程设计记录。工程说明统一放在 `docs/`，避免被 Nextra 当成产品帮助页面发布。

## 展示层

项目基于以下组件工作：

- `nextra-theme-docs`：侧边栏、目录、搜索和主题切换；
- `HelpLink`：通过 Next.js `Link` 提供带说明的内部帮助链接；
- `ThemeImage`：根据明暗主题显示普通图片或 `_dark` 变体；
- `ThemeVideo`：只加载当前主题对应的视频，并在深色变体缺失时回退到普通视频；
- KaTeX/LaTeX：由 Nextra 的 `latex: true` 配置启用数学公式渲染。

站点没有运行时服务器。`output: 'export'` 会为每个可导出路由生成 HTML、JavaScript、CSS 和静态资源。

## 路径模型

[`next.config.mjs`](../next.config.mjs) 将 `basePath` 固定为 `/docs`。该值在构建时进入页面链接和客户端资源路径，因此正式产物必须始终从站点的 `/docs` 子路径访问。

Next.js 首先在 `out/` 生成扁平静态文件。随后 [`postbuild.mjs`](../postbuild.mjs) 将整份产物放入 `out/docs/`。Cloudflare Pages 的输出根目录仍配置为 `out`，于是 Pages 原站能够通过以下形式提供文件：

```text
https://calcx-docs.pages.dev/docs/
https://calcx-docs.pages.dev/docs/about
https://calcx-docs.pages.dev/docs/_next/static/...
```

外部 Worker 只把请求主机从 `calcx.startyi.com` 改成 `calcx-docs.pages.dev`，不会删除 `/docs`。因此 Pages 产物必须物理包含 `docs/` 目录，不能只上传其内部文件。

## 构建后处理

`npm run build` 依次运行 `next build` 和 `postbuild.mjs`。后处理脚本：

1. 把 Next.js 生成的 `out/` 复制到临时的 `out_temp/docs/`；
2. 将构建副本中的本地 PNG/JPG 转换为 WebP；
3. 更新 HTML、JavaScript、JSON 和 CSS 中的本地图片扩展名引用；
4. 清空原始 `out/` 内容；
5. 将处理结果回填为 `out/docs/` 并删除 `out_temp/`。

转换只发生在生成目录中，`public/` 内的原始图片仍作为可维护源文件保留。

## 部署层

Cloudflare 部署分为两个独立对象：

- Pages 项目 `calcx-docs`：从 GitHub 的 `main` 分支构建并托管 `out/`；
- Worker `calcx-docs-proxy`：接管 `calcx.startyi.com/docs*` 并代理到 Pages 原站。

具体参数、Worker 代码、验证步骤和回退方式见[部署指南](DEPLOYMENT.md)。

## 设计约束

- `/docs` 是构建期路径约束；改变它需要同步修改配置、资源路径、Pages 目录布局和 Worker 路由。
- `out/docs/` 是唯一发布产物；`.next/`、`out_temp/` 和 `node_modules/` 都不是发布物。
- 不在 `out/` 中直接修补内容，任何改动都应回到 `pages/`、`components/`、`public/` 或配置文件。
- 产品功能与版本信息必须从 CalculatorX 当前事实核实，不能因为文档框架已有占位页面就宣称功能已完成。
- 客户端集成只约定交付位置，不复制 CalculatorX 内部加载策略。

## 相关文档

- [工程文档索引](README.md)
- [项目结构](PROJECT_STRUCTURE.md)
- [开发指南](DEVELOPMENT.md)
- [部署指南](DEPLOYMENT.md)
