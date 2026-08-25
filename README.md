# CalculatorX 帮助中心

CalculatorX 官方中文帮助中心，为 HarmonyOS 平台上的科学计算器提供快速入门、基础计算、科学计算、历史记录、常见问题和支持信息。

[在线帮助中心](https://calcx.startyi.com/docs/) · [CalculatorX 官网](https://calcx.startyi.com) · [CalculatorX 源码](https://github.com/StarHeartY/CalculatorX)

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/docs/index/scientific_dark.png">
    <img src="public/images/docs/index/scientific.png" alt="CalculatorX 科学计算界面" width="280">
  </picture>
</p>

## 项目状态

网站框架、静态构建、Cloudflare Pages 部署和官网 `/docs` 反向代理链路已经建立。用户手册仍在持续编写，部分专题页面保留占位内容；页面存在不代表对应教程已经完成。

本仓库只维护帮助中心。CalculatorX 应用功能、版本发布和客户端内部加载逻辑由 [CalculatorX 主项目](https://github.com/StarHeartY/CalculatorX)负责。

## 能力

- 使用 Markdown 和 MDX 编写结构化用户手册；
- 使用 Nextra 提供侧边栏、目录、搜索和明暗主题；
- 支持 LaTeX 数学公式；
- 支持普通/暗色截图自动切换；
- 导出纯静态网站，不依赖运行时服务器；
- 构建时将本地 PNG/JPG 副本转换为 WebP；
- 生成统一的 `out/docs/` 产物，用于线上部署和离线交付。

## 技术栈

| 类别 | 方案 |
| --- | --- |
| Web 框架 | Next.js 14（Pages Router） |
| 文档引擎 | Nextra 3 |
| 主题 | `nextra-theme-docs` |
| 页面格式 | Markdown、MDX、React |
| 数学公式 | Nextra LaTeX / KaTeX |
| 图片后处理 | Sharp |
| 构建模式 | Next.js 静态导出 |
| 托管 | Cloudflare Pages |
| 官网接入 | Cloudflare Worker 反向代理到 `/docs` |

## 快速开始

需要 Node.js 18 或更高版本。项目统一使用 npm。

```bash
git clone https://github.com/StarHeartY/CalcX-docs.git
cd CalcX-docs
npm ci
npm run dev
```

访问：

```text
http://localhost:3000/docs
```

## 构建与预览

```bash
npm run build
npm run preview
```

`npm run build` 会执行 Next.js 静态导出和自定义后处理。唯一正式产物是：

```text
out/docs/
```

不要直接修改或提交 `.next/`、`out/`、`out_temp/` 和 `node_modules/`。

## 项目结构

```text
CalcX-docs/
├── pages/              # 发布给 CalculatorX 用户的帮助内容
├── components/         # MDX/React 自定义组件
├── public/images/      # 原始截图和静态图片
├── styles/             # 全站样式
├── docs/               # 本仓库的工程文档
├── AGENTS.md           # AI 协作规则
├── CONTRIBUTING.md     # 贡献和变更流程
├── next.config.mjs     # Nextra、/docs 和静态导出配置
├── theme.config.tsx    # 站点主题与元信息
└── postbuild.mjs       # out/docs 重组与图片后处理
```

完整目录说明见[项目结构](docs/PROJECT_STRUCTURE.md)。

## 工程文档

| 文档 | 内容 |
| --- | --- |
| [工程文档索引](docs/README.md) | 阅读顺序与权威来源 |
| [架构说明](docs/ARCHITECTURE.md) | 内容、构建、Pages、Worker 和离线产物关系 |
| [项目结构](docs/PROJECT_STRUCTURE.md) | 核心目录、配置和生成目录职责 |
| [开发指南](docs/DEVELOPMENT.md) | 环境、命令、工作流和验证方式 |
| [内容编写规范](docs/CONTENT_GUIDE.md) | Markdown、MDX、导航、公式和图片规则 |
| [部署指南](docs/DEPLOYMENT.md) | Cloudflare Pages、Worker、发布与回退 |
| [维护指南](docs/MAINTENANCE.md) | 依赖、事实、链接和基础设施维护 |
| [贡献指南](CONTRIBUTING.md) | 维护者与 AI 的标准变更流程 |
| [AI 协作规则](AGENTS.md) | 修改边界和验证要求 |

## 内容与协作

用户手册页面位于 `pages/`，工程说明位于 `docs/`。新增或修改内容前请阅读[内容编写规范](docs/CONTENT_GUIDE.md)。

项目当前由维护者主导并使用 AI 辅助，不以建设大型贡献者社区为目标。任何修改都应保持范围明确、事实可核实、验证结果可说明，具体流程见[贡献指南](CONTRIBUTING.md)。

## 部署概览

Cloudflare Pages 从 `main` 自动构建 `out/`。独立 Worker `calcx-docs-proxy` 接管 `calcx.startyi.com/docs*`，仅把目标主机替换为 `calcx-docs.pages.dev`，并保留原始 `/docs` 路径。

部署参数和离线交付边界见[部署指南](docs/DEPLOYMENT.md)。

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
