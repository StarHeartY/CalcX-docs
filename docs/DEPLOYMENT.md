
# CalculatorX 帮助文档部署指南

本文档用于说明 CalculatorX 文档系统的构建逻辑、云端环境配置及常见部署问题的排障方案。

## 1. 架构概述

* **部署双端支持**：最终构建产物需同时支持作为静态离线包集成至 DevEco Studio 的 `rawfile`，以及通过 Cloudflare Pages 自动部署上线。
* **反向代理路由**：线上网络请求通过 Cloudflare Worker 拦截 [calcx.startyi.com/docs](https://calcx.startyi.com/docs) 的流量，并透明代理至底层 Pages 项目（`calcx-docs.pages.dev`）。
* **路径映射规则**：因 Worker 代理时完整保留了 `/docs` 路径前缀，Pages 项目的根目录下必须物理包含名为 `docs` 的子目录，以实现路由匹配。

## 2. 构建流程与脚本

项目的定制构建流由根目录下的 `postbuild.mjs` 接管，主要执行以下操作：

* **目录重构**：将 Next.js 默认生成的扁平化 `out` 目录内容，通过临时目录（`out_temp`）作为缓冲，安全转移至最终的 `out/docs` 嵌套结构中，避免文件系统出现无限循环复制。
* **资源压缩**：自动扫描并使用 `sharp` 将图片统一转换为 WebP 格式，同时通过正则替换 HTML/JS/CSS 中的静态资源引用路径。
* **防死锁机制**：针对 Windows 环境下防病毒软件扫描导致的文件句柄锁定问题，目录回填阶段强制使用 `fs.cpSync` 替代 `fs.renameSync` 以规避 `EPERM` 权限报错。

## 3. Cloudflare Pages 部署配置

在 Cloudflare Pages 的“构建和部署”设置中，必须严格按照以下参数进行配置。禁止使用任何额外的 Shell 脚本（如 `mkdir` 或 `cp` 命令）。

* **构建命令 (Build command)**：`npm run build`
* **构建输出目录 (Build output directory)**：`out`

