# CalcX-docs 工程文档

本目录保存 CalcX-docs 仓库的工程、协作与维护说明。面向 CalculatorX 用户发布的使用手册位于 [`pages/`](../pages/)，不在本目录维护。

## 建议阅读顺序

| 文档 | 适用场景 |
| --- | --- |
| [架构说明](ARCHITECTURE.md) | 了解文档源码如何构建、部署并出现在官网 `/docs` 下 |
| [项目结构](PROJECT_STRUCTURE.md) | 查找页面、组件、资源、配置和生成目录 |
| [开发指南](DEVELOPMENT.md) | 安装依赖、本地预览、构建和验证修改 |
| [内容编写规范](CONTENT_GUIDE.md) | 新建或维护 Markdown、MDX、公式、图片和导航 |
| [部署指南](DEPLOYMENT.md) | 了解 Cloudflare Pages、反向代理和离线产物 |
| [维护指南](MAINTENANCE.md) | 处理依赖、事实同步、链接审计和基础设施变更 |
| [贡献指南](../CONTRIBUTING.md) | 按仓库约定组织一次完整变更 |
| [AI 协作规则](../AGENTS.md) | AI 或自动化工具在修改前必须遵守的边界 |

## 权威来源

同一个事实只保留一个主要来源，其他文档通过链接引用：

| 事实 | 主要来源 |
| --- | --- |
| 项目定位与快速入口 | [`README.md`](../README.md) |
| 目录与文件职责 | [项目结构](PROJECT_STRUCTURE.md) |
| 本地命令与验证方式 | [开发指南](DEVELOPMENT.md) |
| 页面写作与资源规范 | [内容编写规范](CONTENT_GUIDE.md) |
| 构建产物与云端链路 | [部署指南](DEPLOYMENT.md) |
| AI 修改边界 | [`AGENTS.md`](../AGENTS.md) |
| 实际脚本、依赖与路径 | 当前仓库中的配置和源码 |

当文档与实际配置不一致时，以当前源码和部署配置为调查依据，并在同一次变更中修正文档。CalculatorX 的功能、版本和交互事实必须从 CalculatorX 项目或维护者提供的当前信息核实，不能从本仓库旧页面反推。

## 目录边界

- `pages/`：发布给 CalculatorX 用户的帮助内容。
- `docs/`：CalcX-docs 仓库本身的工程文档。
- `out/docs/`：构建生成的唯一发布产物，不参与手工编辑。
- CalculatorX 主项目：负责客户端如何加载离线帮助，本仓库只生成并交付静态文件。

## 维护原则

- 只记录已经从配置、源码或维护者信息核实的事实。
- 专题内容放在对应文档中，索引不复制正文。
- 新增工程文档前先确认现有文档是否已经承担相同职责。
- 修改导航后检查相对链接、Markdown 锚点和返回路径。

[返回项目 README](../README.md)
