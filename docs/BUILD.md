# 📖 CalculatorX 离线帮助中心更新 SOP

本文档规定了在完成 Markdown 内容更新后，如何将最新文档打包并更新至 CalculatorX 鸿蒙客户端的完整标准流程。

### 1. 内容更新与本地验证

- 在 `pages` 目录下正常新建或修改 `.mdx` 文件。
- 如有需要，调整 `_meta.js` 以更新侧边栏菜单路由。
- 将原始 PNG/JPG 截图直接放入 `public/images` 目录，无需手动压缩。
- 运行 `npm run dev` 在 `localhost:3000/docs` 验证排版与深色模式双态图效果。

### 2. 触发全自动离线构建

- 在文档工程根目录终端执行核心指令：
  ```bash
  npm run build
  ```


- **流水线内部动作（自动完成）：**
  1. 编译纯静态 HTML/CSS/JS。
  2. 底层 `sharp` 引擎将 PNG/JPG 压缩为高品质 WebP 并删除原图。
  3. 全局重定向底层代码中的图片路径。
  4. 通过旁路输出机制，将最终纯净产物安全存放至 `release/docs` 文件夹。



### 3. 与 CalculatorX 集成

- 找到新生成的 `release/docs` 文件夹。
- **关键操作：** 仅复制 `docs` 这个文件夹本身，将其粘贴并**完全覆盖**CalculatorX项目中的对应目录：
`entry/src/main/resources/rawfile/docs`
