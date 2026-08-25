# CalcX-docs AI 协作规则

本文件适用于整个 CalcX-docs 仓库。AI、自动化工具和后续维护者在修改前必须先阅读本文件，并根据任务读取相关工程文档。

## 项目目标

CalcX-docs 是 CalculatorX 的中文帮助中心源码。仓库将 Markdown/MDX 用户手册构建为 `out/docs/` 静态产物，用于 Cloudflare Pages 在线部署和 CalculatorX 离线帮助交付。

## 开始前

1. 阅读 [`README.md`](README.md) 和 [`docs/README.md`](docs/README.md)；
2. 根据任务读取对应文档：
   - 页面内容：[`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md)
   - 组件或配置：[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) 与 [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)
   - 构建或发布：[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
   - 依赖或长期维护：[`docs/MAINTENANCE.md`](docs/MAINTENANCE.md)
3. 检查 `git status`，把现有修改视为维护者所有；
4. 读取实际源码和配置，不根据旧 README、历史对话或占位页面猜测当前状态。

## 固定边界

- `pages/` 保存面向 CalculatorX 用户的帮助内容；
- `docs/` 保存 CalcX-docs 仓库的工程文档；
- CalculatorX 主项目负责客户端实现，本仓库只约定离线产物交付位置；
- Cloudflare Worker 是外部基础设施，本仓库记录其当前接口，但不保存账号配置、密钥或令牌；
- `basePath: '/docs'`、Pages 的 `out` 输出根目录和最终 `out/docs/` 产物共同组成当前部署模型。

会改变这些边界的任务必须先说明影响范围，不能顺手调整。

## 修改规则

- 只修改任务纳入范围的文件，不重构、格式化或清理无关内容；
- 不覆盖来源不明的工作区修改；
- 不直接编辑 `.next/`、`out/`、`out_temp/` 或 `node_modules/`；
- 不提交生成目录、本地日志、PSD、临时截图或私密信息；
- 包管理器统一使用 npm，只维护 `package-lock.json`；
- 普通用户手册优先使用 `.md`，只有需要组件或 JSX 时使用 `.mdx`；
- 新增或移动页面时同步检查同级 `_meta.js`；
- 新增工程文档前确认没有职责重复的权威文档；
- 删除、移动或批量替换前解析准确目标，并确保可通过 Git 恢复。

## 产品事实

- CalculatorX 的功能、版本、设置路径、隐私行为和兼容性必须从当前应用实现、配置、发布说明或维护者信息核实；
- 不把“敬请期待”页面、文件名或导航标题当作已完成功能的证据；
- 无法核实的内容不要写入正式用户手册；
- 文档中的正式措辞面向用户或工程维护者，不记录协作过程和临时讨论。

## 内容与资源

- 页面标题、文件名和 `_meta.js` 导航含义保持一致；
- 公式使用项目已启用的 LaTeX 能力，不使用截图替代可表达的公式；
- 原始图片放入 `public/images/`，构建脚本负责产物 WebP 转换；
- 图片必须提供准确 alt，明暗主题变体使用 `_dark` 后缀；
- 使用 Next.js/Nextra Link 时不要手工重复 `/docs`；资源路径则必须符合当前 basePath；
- 修改标题、路由或导航后检查相关链接和 Markdown 锚点。

## 验证要求

按修改风险选择验证：

| 修改 | 最低验证 |
| --- | --- |
| 纯文字、README、工程 Markdown | `git diff --check`，本地文件链接和锚点检查 |
| 单个 Markdown 用户页面 | 内容和导航检查，必要时开发预览 |
| MDX、图片、公式、`_meta.js` | 开发预览；结构变化时运行完整构建 |
| 组件、样式、依赖、配置 | `npm run build` 和相关页面检查 |
| `postbuild.mjs`、basePath、部署路径 | `node --check postbuild.mjs`、完整构建、核对 `out/docs/` |

不要声称执行了未运行的构建或目视检查。交付时说明已验证项、未验证项和需要维护者完成的外部操作。

## Git 与部署

- 未经维护者明确要求，不创建提交、推送、合并或修改 Cloudflare；
- 较大变更优先通过短期分支和 Cloudflare Preview 验证；
- `main` 是生产分支，推送后会自动触发 Pages 部署；
- Preview URL 是临时审查地址，不能写入长期文档；
- 生产部署异常时优先恢复源码并重新构建，不直接修改生成产物。

## 交付格式

完成任务后简要报告：

- 修改的文件和结果；
- 采用的事实来源或关键假设；
- 执行的验证及结果；
- 未验证内容和原因；
- 是否需要维护者在 Cloudflare 或 CalculatorX 项目中继续操作。
