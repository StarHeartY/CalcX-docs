# CalculatorX 帮助中心

基于 [Nextra](https://nextra.site) v3 构建的 **CalculatorX** 官方中文文档站，为 HarmonyOS 平台上的专业级符号计算器提供完整的使用指南与参考。

## 项目概述

CalculatorX 是一款运行于 **HarmonyOS** 的高性能科学计算器，具备 CAS（计算机代数系统）引擎，支持微积分、方程求解、符号推导、函数图像等多场景计算需求。

本站点即为 CalculatorX 的用户手册，内容涵盖：

- **快速入门** — 应用界面与基本交互
- **基础运算篇** — 四则运算、历史记录等常规操作
- **科学计算篇** — 三角函数、指数对数、科学常数、微积分等
- **高级代数与 CAS 引擎篇** — 符号推导、方程求解、代数运算
- **常见问题与支持篇** — FAQ、更新日志、隐私声明

## 技术栈

| 类别 | 方案 |
|------|------|
| 框架 | [Next.js 14](https://nextjs.org) (Pages Router) |
| 文档引擎 | [Nextra v3](https://nextra.site) |
| 主题 | `nextra-theme-docs` |
| 渲染 | MDX + LaTeX（数学公式） |
| 部署 | 纯静态导出 (`output: 'export'`) |

## 本地开发

确保已安装 **Node.js 18+** 和 **pnpm**。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

浏览器访问 `http://localhost:3000/docs` 即可预览。

## 生产构建

```bash
pnpm build
```

产物输出至 `out/` 目录，可直接部署到任意静态托管服务。

## 目录结构

```
CalcX-docs/
├── pages/                  # 文档页面 (MDX)
│   ├── index.mdx           # 首页
│   ├── about.mdx           # 关于页
│   ├── _meta.js            # 顶部导航配置
│   ├── basics/             # 基础运算篇
│   ├── scientific/         # 科学计算篇
│   ├── cas/                # CAS 引擎篇
│   └── support/            # FAQ 与支持
├── components/             # 自定义 React 组件
├── public/
│   └── images/             # 配图资源
├── theme.config.jsx        # Nextra 主题配置
├── next.config.mjs         # Next.js + Nextra 配置
└── package.json
```

## 相关链接

- [CalculatorX 主站](https://calcx.startyi.com)
- [CalculatorX 源码](https://github.com/StarHeartY/CalculatorX)
- [Nextra 文档](https://nextra.site)

## 开源许可

本项目基于 MIT 协议开源。
