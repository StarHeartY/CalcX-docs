# 开发指南

本指南说明 CalcX-docs 的本地环境、常用命令、修改流程和验证方式。用户手册的写作约定见[内容编写规范](CONTENT_GUIDE.md)。

## 环境要求

- Node.js 18 或更高版本；
- npm；
- Git；
- 可访问 npm 公共依赖源的网络环境。

本项目统一使用 npm 和 `package-lock.json`。不要使用 pnpm、Yarn 或其他工具重新生成依赖锁定文件。

查看本地版本：

```bash
node --version
npm --version
```

## 初始化

克隆仓库后，在项目根目录安装锁定版本的依赖：

```bash
npm ci
```

`npm ci` 会严格按照 `package-lock.json` 安装，并重建 `node_modules/`。只有在明确升级或调整依赖时才使用 `npm install` 更新锁定文件。

## 常用命令

| 命令 | 用途 | 主要输出 |
| --- | --- | --- |
| `npm run dev` | 启动 Next.js 开发服务器 | 内存和 `.next/` |
| `npm run build` | 静态构建并执行后处理 | `out/docs/` |
| `npm run preview` | 用静态文件服务器预览 `out/` | 本地 HTTP 服务 |

开发服务器默认访问地址：

```text
http://localhost:3000/docs
```

生产预览前必须先执行：

```bash
npm run build
npm run preview
```

然后访问静态服务器显示的地址，并进入 `/docs`。

## 开发模式与生产产物

`npm run dev` 由 Next.js 直接提供页面，适合快速检查内容和样式。它不会执行 `postbuild.mjs`，也不会生成最终的 `out/docs/`。

`npm run build` 包含两个阶段：

1. `next build` 根据 `output: 'export'` 生成静态文件；
2. `postbuild.mjs` 重组目录并把构建副本中的本地 PNG/JPG 转为 WebP。

因此，仅在开发服务器中显示正常并不能证明最终发布产物完整。涉及页面结构、组件、图片、配置或构建逻辑时，需要运行生产构建。

## 推荐修改流程

### 内容页面

1. 在 `pages/` 中定位或创建 `.md`/`.mdx`；
2. 需要加入导航时更新同级 `_meta.js`；
3. 根据[内容编写规范](CONTENT_GUIDE.md)添加链接、公式和图片；
4. 使用 `npm run dev` 检查页面、窄屏和明暗主题；
5. 页面结构或 MDX 组件有变化时运行 `npm run build`。

### React 组件或样式

1. 搜索组件的全部引用位置；
2. 保持现有组件 API，除非任务明确要求同步调用方；
3. 检查亮色、暗色、桌面和窄屏布局；
4. 执行完整构建。

### 配置或构建脚本

1. 先阅读[架构说明](ARCHITECTURE.md)和[部署指南](DEPLOYMENT.md)；
2. 同时检查 `next.config.mjs`、`postbuild.mjs`、`package.json` 及 Cloudflare 路径假设；
3. 执行 `npm run build`；
4. 确认 `out/docs/index.html` 和 `out/docs/_next/` 存在；
5. 使用 `npm run preview` 验证深层页面和静态资源。

## 验证矩阵

验证力度按风险选择：

| 修改类型 | 最低验证 |
| --- | --- |
| README、工程文档中的纯文字 | `git diff --check`，检查本地链接和锚点 |
| 单个纯 Markdown 页面 | 内容审阅、导航检查；必要时开发预览 |
| MDX、公式、图片或 `_meta.js` | `npm run dev` 目视检查，建议完整构建 |
| React 组件、样式、依赖、配置 | `npm run build`，并检查相关页面 |
| `postbuild.mjs` 或部署路径 | `node --check postbuild.mjs`、完整构建、检查 `out/docs/` |

交付时应说明实际执行的检查和未执行的检查，不能用静态检查代替未运行的构建。

## 生成目录规则

- 不直接编辑 `.next/`、`out/` 或 `out_temp/`；
- 不把生成目录加入 Git；
- 构建失败后如残留 `out_temp/`，确认没有需要保留的调试信息后再重新构建；
- 需要修改生成结果时，回到对应的源码、资源或脚本修复。

## 常见排查

### `/docs` 页面或资源返回 404

检查：

- `next.config.mjs` 是否仍使用 `basePath: '/docs'`；
- 最终文件是否位于 `out/docs/`；
- 页面是否存在对应的 `.md`/`.mdx` 源文件；
- Cloudflare Worker 是否仍保留 `/docs` 路径。

### 图片在开发环境正常、构建后异常

检查：

- 原图是否位于 `public/images/`；
- 生成的 WebP 是否存在于 `out/docs/images/`；
- HTML/JavaScript 中的图片引用是否已更新；
- 明暗主题图片是否遵循 `_dark` 命名约定。

### Windows 构建出现文件占用

关闭正在读取 `out/` 的本地预览服务后重试。后处理脚本使用复制而非目录重命名，以降低 Windows 文件句柄占用导致的 `EPERM` 风险。

## 相关文档

- [工程文档索引](README.md)
- [项目结构](PROJECT_STRUCTURE.md)
- [内容编写规范](CONTENT_GUIDE.md)
- [部署指南](DEPLOYMENT.md)
- [贡献指南](../CONTRIBUTING.md)
