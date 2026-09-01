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
| 生产环境变量（要求） | `NODE_VERSION=24`，需在外部控制台确认 |
| Pages 域名 | `calcx-docs.pages.dev` |

仓库通过 `.nvmrc`、`.node-version` 和 `package.json` 统一使用 Node.js 24 LTS。Cloudflare Pages 是仓库外配置，更新仓库后仍需在控制台确认 Production 和 Preview 都使用 `NODE_VERSION=24`；如果外部配置仍覆盖为 Node.js 18，Sharp 图片处理会因运行时版本过低而失败。

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

## 阿里云 ECS

仓库通过 [`.github/workflows/deploy-aliyun.yml`](../.github/workflows/deploy-aliyun.yml) 将同一份静态产物部署到阿里云 ECS。该流程在推送 `main` 或手动触发时运行：

1. 使用 `.node-version` 指定的 Node.js 24；
2. 执行 `npm ci` 和 `npm run build`；
3. 检查 `out/docs/` 的首页、404、静态资源目录和 `/docs` 资源前缀；
4. 校验 ECS 的 SSH host key，并使用仓库 Secret `ALIYUN_SSH_KEY` 连接 `agent` 用户；
5. 把 `out/docs/` 中的内容上传到提交 SHA 对应的版本目录；
6. 验证版本完整后，原子切换 `current` 符号链接；
7. 从 ECS 本机携带 `Host: calcx.startyi.cn` 请求 Nginx，检查首页和深层页面。

ECS 发布结构为：

```text
/var/www/calcx-docs
        -> /var/www/calcx-docs-releases/current
        -> /var/www/calcx-docs-releases/<commit-sha>/
```

版本目录直接包含 `index.html`、`404.html`、`_next/` 和 `images/`，不会再增加一层 `docs/`。Nginx 在现有 `calcx.startyi.cn` HTTP server block 中把 URL `/docs/` 映射到 `/var/www/calcx-docs/`，并负责：

- 将 `/docs` 重定向到 `/docs/`；
- 为无扩展名页面查找同名 `.html`；
- 保留 `/docs/_next/`、图片和字体资源路径；
- 对不存在的文档页面返回 `404.html`，同时保留 HTTP 404 状态。

Nginx、DNS、HTTPS 证书和安全组均为服务器外部配置，不由 workflow 修改。DNS 和 HTTPS 就绪前，可在 ECS 本机通过以下方式验证当前 HTTP server block：

```bash
curl -H 'Host: calcx.startyi.cn' http://127.0.0.1/docs/
```

旧版本不会在新版本上传时被覆盖，可通过重新指向 `current` 完成快速回退。历史版本需由维护者在确认不再需要后单独清理。

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

- 推送到 `main` 会触发 Cloudflare Pages Production 构建，并运行 GitHub Actions 更新 ECS 静态版本；
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

ECS 发布还应检查：

1. `/docs` 返回到 `/docs/` 的永久重定向；
2. `/docs/`、`/docs/about` 和至少一个深层页面返回 200；
3. `/docs/_next/` 下的 JavaScript/CSS 和图片资源返回正确 MIME；
4. 不存在的文档页面显示自定义页面并保持 HTTP 404；
5. 主站 `/` 和主站原有 404 行为不受影响。

## 故障定位

| 现象 | 优先检查 |
| --- | --- |
| Pages 构建失败 | Cloudflare 构建日志、Node 版本、npm 安装和 `postbuild.mjs` |
| Pages `/docs` 404 | 输出目录是否为 `out`，产物是否实际位于 `out/docs/` |
| Pages 正常但官网 404 | Worker 路由、Worker 部署状态和目标 hostname |
| HTML 正常但 CSS/JS 404 | `/docs/_next/` 是否存在，basePath 是否仍为 `/docs` |
| 构建后图片 404 | WebP 是否生成、产物引用是否已替换、源图片路径是否正确 |
| 生产异常但 Preview 正常 | `main` 对应部署、生产环境变量和 Worker 目标主机 |
| Actions 无法连接 ECS | `ALIYUN_SSH_KEY`、SSH host key 指纹和 `agent` 授权 |
| ECS `/docs` 404 | `current` 指向、版本目录关键文件和 Nginx `/docs` location |
| ECS HTML 正常但资源 404 | 是否上传了 `out/docs/` 的内容、`_next/` 是否位于版本目录根部 |

## 回退

如果 Cloudflare 生产部署出现问题：

1. 保留失败部署的日志和提交标识；
2. 在 Git 中恢复到最近一次确认可用的源码状态，或回退引入问题的提交；
3. 推送 `main` 触发新的生产构建；
4. 按“发布验证”重新检查 Pages 原站和官网代理地址；
5. 根因修复后补充相关工程文档或维护记录。

如果 ECS 发布出现问题：

1. 找到 `/var/www/calcx-docs-releases/` 中最近一次确认可用的提交目录；
2. 在该目录内创建新的临时符号链接；
3. 使用 `mv -T` 原子替换 `current`，不要直接修改或清空版本目录；
4. 重新检查 `/docs/`、深层页面、静态资源和 404；
5. 保留失败版本用于排查，确认不再需要后再单独删除。

## 相关文档

- [工程文档索引](README.md)
- [架构说明](ARCHITECTURE.md)
- [开发指南](DEVELOPMENT.md)
- [维护指南](MAINTENANCE.md)
