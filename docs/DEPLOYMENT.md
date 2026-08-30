# 部署指南

本指南记录 CalcX-docs 当前可复现的构建与发布链路。Cloudflare Pages 和 Worker 是仓库外部基础设施；配置发生变化时，应在同一次维护中更新本页。

## 发布产物

唯一正式发布产物是：

```text
out/docs/
```

不要发布 `.next/`、`out_temp/`，也不要把 Next.js 初始生成的扁平 `out/` 内容当作最终产物。`out_temp/` 只是构建期间使用的临时缓冲目录。

## 生成产物

在仓库根目录执行：

```bash
npm ci
npm run build
```

`npm run build` 先运行 `next build`，再运行 `postbuild.mjs`：

1. Next.js 静态导出到 `out/`；
2. 后处理脚本复制产物到 `out_temp/docs/`；
3. 构建副本中的本地 PNG/JPG 转换为质量 80 的 WebP；
4. HTML、JavaScript、JSON 和 CSS 中的本地图片扩展名引用同步更新；
5. 处理结果回填到 `out/docs/`；
6. `out_temp/` 被删除。

原始图片仍保留在 `public/` 中，不会被构建脚本删除。

构建完成后至少确认：

```text
out/docs/index.html
out/docs/404.html
out/docs/_next/
out/docs/images/
```

## Cloudflare Pages

当前 Pages 项目配置：

| 配置 | 当前值 |
| --- | --- |
| 项目名称 | `calcx-docs` |
| Git 仓库 | `StarHeartY/CalcX-docs` |
| 生产分支 | `main` |
| 自动部署 | 已启用 |
| 构建命令 | `npm run build` |
| 构建输出目录 | `out` |
| 根目录 | 仓库根目录 |
| 构建监视路径 | `*` |
| 构建系统 | 版本 3 |
| 构建缓存 | 当前禁用 |
| 生产环境变量 | `NODE_VERSION=18` |
| Pages 域名 | `calcx-docs.pages.dev` |

项目的本地最低要求是 Node.js 18，生产 Pages 当前明确固定为 Node.js 18。升级生产 Node.js 版本前，应先在分支部署中完成构建和页面验证。

Pages 输出目录配置为 `out`，但其中真正的网站位于 `out/docs/`。因此 Pages 原站的有效入口是：

```text
https://calcx-docs.pages.dev/docs/
```

根地址 `https://calcx-docs.pages.dev/` 没有帮助中心首页并不代表构建失败。

## Cloudflare Worker

官网 `/docs` 由独立 Worker 反向代理：

| 配置 | 当前值 |
| --- | --- |
| Worker 名称 | `calcx-docs-proxy` |
| 所属区域 | `startyi.com` |
| 自定义路由 | `calcx.startyi.com/docs*` |
| 生产 Worker URL | `calcx-docs-proxy.starheart-yi.workers.dev` |
| 目标 Pages 主机 | `calcx-docs.pages.dev` |

Worker 的核心逻辑：

```js
export default {
  async fetch(request) {
    const url = new URL(request.url)

    url.hostname = 'calcx-docs.pages.dev'

    return fetch(new Request(url, request))
  }
}
```

该 Worker 只替换请求 URL 的 hostname：

- `/docs` 路径保持不变；
- 查询参数保持不变；
- 请求方法、请求头和请求体通过新 Request 继续传递；
- 不在 Worker 中实现页面缓存、身份验证或响应内容改写。

Worker 代码和路由不存放在本仓库。修改它们时，应核对这里记录的架构事实，但不要把 Cloudflare 密钥、令牌或账号信息写入仓库。

## 请求流程

```text
https://calcx.startyi.com/docs/...
        │
        │ 路由 calcx.startyi.com/docs*
        ▼
calcx-docs-proxy
        │ 仅将 hostname 替换为 calcx-docs.pages.dev
        ▼
https://calcx-docs.pages.dev/docs/...
        │
        ▼
Cloudflare Pages 的 out/docs/...
```

由于 Worker 保留 `/docs`，以下三项必须保持一致：

- Next.js `basePath: '/docs'`；
- 构建产物目录 `out/docs/`；
- Worker 路由和转发后的请求路径 `/docs...`。

## 自动部署与预览

- 推送到 `main` 会触发 Production 构建并更新 Pages 生产部署；
- 非生产分支可以生成独立的 Preview 部署；
- 较大的内容、样式、依赖或构建变更应先通过 Preview URL 验证；
- Preview URL 只用于审查，不写入 README 或用户手册作为长期链接。

## 客户端离线产物

需要向 CalculatorX 项目交付离线帮助时，只复制构建生成的 `out/docs/` 目录到：

```text
entry/src/main/resources/rawfile/docs
```

本仓库只保证交付目录和静态文件完整。CalculatorX 如何加载、更新和验证 `rawfile/docs` 属于 CalculatorX 项目职责，不在这里复制维护。

## 发布验证

部署后按顺序检查：

1. `https://calcx-docs.pages.dev/docs/` 能打开首页；
2. Pages 原站的深层页面和 `/_next/` 静态资源正常；
3. `https://calcx.startyi.com/docs/` 能通过 Worker 打开同一内容；
4. 官网深层页面刷新后仍返回正确 HTML；
5. 页面导航、搜索、亮色/暗色图片和数学公式正常；
6. 不存在把 Preview URL、构建日志或私密配置写入公开页面的情况。

## 故障定位

| 现象 | 优先检查 |
| --- | --- |
| Pages 构建失败 | Cloudflare 构建日志、Node 版本、npm 安装和 `postbuild.mjs` |
| Pages `/docs` 404 | 输出目录是否为 `out`，产物是否实际位于 `out/docs/` |
| Pages 正常但官网 404 | Worker 路由、Worker 部署状态和目标 hostname |
| HTML 正常但 CSS/JS 404 | `/docs/_next/` 是否存在，basePath 是否仍为 `/docs` |
| 构建后图片 404 | WebP 是否生成、产物引用是否已替换、源图片路径是否正确 |
| 生产异常但 Preview 正常 | `main` 对应部署、生产环境变量和 Worker 目标主机 |

## 回退

如果生产部署出现问题：

1. 保留失败部署的日志和提交标识；
2. 在 Git 中恢复到最近一次确认可用的源码状态，或回退引入问题的提交；
3. 推送 `main` 触发新的生产构建；
4. 按“发布验证”重新检查 Pages 原站和官网代理地址；
5. 根因修复后补充相关工程文档或维护记录。

## 相关文档

- [工程文档索引](README.md)
- [架构说明](ARCHITECTURE.md)
- [开发指南](DEVELOPMENT.md)
- [维护指南](MAINTENANCE.md)
