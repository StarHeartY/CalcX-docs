# 项目结构

本页描述 CalcX-docs 当前仓库的核心目录和文件职责。目录树只展开日常开发需要直接定位的部分，生成目录和工具缓存不逐项展开。

## 核心目录树

```text
CalcX-docs/
├── pages/                       # CalculatorX 用户手册源码
│   ├── _app.jsx                 # 注入全站样式
│   ├── _meta.js                 # 顶层导航与页面顺序
│   ├── index.mdx                # 快速入门与帮助中心首页
│   ├── about.mdx                # 关于 CalculatorX
│   ├── history.mdx              # 局部与全局历史记录
│   ├── settings.mdx             # 计算、外观与体验设置
│   ├── troubleshooting.mdx      # 跨模块常见问题与故障排查
│   ├── basics/                  # 基础使用页面及局部导航
│   ├── scientific/              # 科学计算专题及局部导航
│   ├── equations/               # 单个方程与方程组教程
│   ├── matrix/                  # 矩阵输入与线性代数运算教程
│   ├── graphing/                # 函数类型、编辑管理与画布操作教程
│   └── exchange/                # 汇率换算、货币列表与离线缓存教程
├── components/                  # MDX 使用的 React 组件
│   ├── HelpLink.jsx
│   └── ThemeImage.jsx
├── public/                      # 构建时原样收集的静态源资源
│   ├── favicon.png
│   └── images/
├── styles/
│   └── global.css               # 全站和自定义组件样式
├── docs/                        # 本仓库工程文档
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── DEVELOPMENT.md
│   ├── CONTENT_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── MAINTENANCE.md
├── README.md                    # 项目入口
├── AGENTS.md                    # AI 协作规则
├── CONTRIBUTING.md              # 贡献与变更流程
├── next.config.mjs              # Nextra、LaTeX、basePath 和静态导出
├── theme.config.tsx             # Nextra 文档主题配置
├── postbuild.mjs                # 产物重组和 WebP 转换
├── .nvmrc                       # nvm 使用的 Node.js 24 版本约束
├── .node-version                # 通用 Node.js 24 版本约束
├── package.json                 # npm 脚本与依赖
├── package-lock.json            # npm 依赖锁定文件
└── tsconfig.json                # TypeScript/JSX 工具配置
```

## 源码职责

### `pages/`

`pages/` 中的文件决定帮助中心的用户可见路由。新增页面通常同时涉及页面文件和同级 `_meta.js`。普通内容优先使用 `.md`，只有需要组件、JSX 或交互能力时才使用 `.mdx`。

### `components/`

这里存放 MDX 可复用的展示组件。修改组件可能影响多个页面，必须搜索调用位置并执行完整构建。

- `HelpLink.jsx`：内部说明链接；
- `ThemeImage.jsx`：明暗主题图片切换；页面引用普通图片时会自动查找同目录下的 `_dark` 变体。

### `public/`

保存构建源图片和图标。PNG/JPG 原图在这里长期维护；构建脚本只在最终产物中转换为 WebP，不修改源文件。

### `docs/`

保存仓库工程文档，不参与 Nextra 用户手册路由。工程规则、架构、开发和部署信息应写在这里，CalculatorX 使用教程则写在 `pages/`。

## 配置文件

| 文件 | 职责 |
| --- | --- |
| `package.json` | npm 命令、运行依赖和开发依赖 |
| `next.config.mjs` | Nextra 主题、LaTeX、`/docs` basePath、静态导出 |
| `theme.config.tsx` | 站点标题、搜索、主题、页脚、SEO 元信息 |
| `postbuild.mjs` | 把静态产物整理成 `out/docs/` 并转换图片 |
| `.nvmrc`、`.node-version` | 将本地、CI 和云端构建统一到 Node.js 24 |
| `styles/global.css` | 自定义样式和明暗主题显示规则 |
| `tsconfig.json` | 编辑器和 TypeScript/JSX 分析配置 |
| `.gitignore` | 排除依赖、缓存、构建产物和本地设计源文件 |

## 生成目录

以下目录都可通过安装或构建重新生成，不应手工维护或提交：

| 目录 | 来源 | 用途 |
| --- | --- | --- |
| `node_modules/` | `npm ci` | 本地依赖 |
| `.next/` | `next dev` / `next build` | Next.js 缓存和中间产物 |
| `out_temp/` | `postbuild.mjs` | 构建期间的临时缓冲目录 |
| `out/` | `npm run build` | 最终静态发布根目录 |
| `out/docs/` | `postbuild.mjs` | 唯一可部署、可交付的帮助中心产物 |

## 常见修改位置

| 目标 | 通常修改的位置 |
| --- | --- |
| 新增用户教程 | `pages/<section>/<page>.md` 和对应 `_meta.js` |
| 使用 React/Nextra 组件 | `.mdx` 页面与 `components/` |
| 添加截图 | `public/images/`，必要时添加 `_dark` 变体 |
| 修改站点导航 | `pages/_meta.js` 或子目录 `_meta.js` |
| 修改站点主题或元信息 | `theme.config.tsx`、`styles/global.css` |
| 修改构建路径 | `next.config.mjs`、`postbuild.mjs` 和部署文档 |
| 修改工程说明 | `README.md`、`docs/`、`AGENTS.md`、`CONTRIBUTING.md` |

## 相关文档

- [工程文档索引](README.md)
- [架构说明](ARCHITECTURE.md)
- [开发指南](DEVELOPMENT.md)
- [内容编写规范](CONTENT_GUIDE.md)
