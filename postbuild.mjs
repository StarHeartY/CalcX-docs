import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 定义路径
const outDir = path.join(process.cwd(), 'out');
const tempDir = path.join(process.cwd(), 'out_temp');
const targetDocsDir = path.join(tempDir, 'docs');

// 递归获取所有文件的辅助函数
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

async function main() {
  try {
    if (!fs.existsSync(outDir)) {
      console.error('❌ 找不到 out 目录，请先确保 next build 成功运行。');
      return;
    }

    console.log('📦 [1/5] 正在创建临时缓冲跳板...');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDocsDir, { recursive: true });
    fs.cpSync(outDir, targetDocsDir, { recursive: true });

    // 获取临时 docs 目录下的所有文件
    const allFiles = getAllFiles(targetDocsDir);

    // 找出所有图片
    const imageFiles = allFiles.filter(f => /\.(png|jpe?g)$/i.test(f));

    if (imageFiles.length > 0) {
      console.log(`🖼️ [2/5] 引擎启动：拦截到 ${imageFiles.length} 张原图，正在极限压缩为 WebP...`);

      // 并发执行所有的图片压缩任务，榨干 CPU 性能
      await Promise.all(imageFiles.map(async (imgPath) => {
        const webpPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');
        // 使用 sharp 转换并输出
        await sharp(imgPath).webp({ quality: 80 }).toFile(webpPath);
        // 毁尸灭迹，删除原图
        fs.unlinkSync(imgPath);
      }));

      console.log(`📝 [3/5] 正在篡改底包：全局重定向图片引用...`);
      // 找出所有可能包含图片路径的代码文件
      const codeFiles = allFiles.filter(f => /\.(html|js|json|css)$/i.test(f));

      for (const codePath of codeFiles) {
        let content = fs.readFileSync(codePath, 'utf8');

        // 如果文件里提到了 png/jpg/jpeg，替换为 webp
        const safeRegex = /(?<!https?:\/\/[^"']*)(?:\.(png|jpe?g))/gi;

        if (content.match(safeRegex)) {
          content = content.replace(safeRegex, '.webp');
          fs.writeFileSync(codePath, content, 'utf8');
        }
      }
    } else {
      console.log(`🖼️ [2/5] 未检测到需要压缩的图片，跳过。`);
    }

    console.log('🧹 [4/5] 正在安全清空原始 out 目录 (保留外壳防锁)...');
    // 逐一删除 out 里面的子文件/文件夹，绝不碰 out 文件夹本身
    const outItems = fs.readdirSync(outDir);
    for (const item of outItems) {
      const itemPath = path.join(outDir, item);
      fs.rmSync(itemPath, { recursive: true, force: true });
    }

    console.log('🚚 [5/5] 正在将精装产物回填至 out/docs 并销毁跳板...');
    const finalDocsDir = path.join(outDir, 'docs');
    // 把加工好的 docs 文件夹瞬间移动到 out 里面
    fs.cpSync(targetDocsDir, finalDocsDir, { recursive: true });
    // 销毁外部的 out_temp 空壳
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('🔗 [SEO 1/2] 正在校验页面导出的 canonical...');
    const canonicalOrigin = 'https://calcx.startyi.com';
    const canonicalBasePath = '/docs';

    // 线上服务器的规范化形式：目录索引带斜杠（/docs/ → index.html），其余页面不带斜杠
    function canonicalUrlFor(htmlPath) {
      const rel = path.relative(finalDocsDir, htmlPath).split(path.sep).join('/');
      if (rel === 'index.html') {
        return `${canonicalOrigin}${canonicalBasePath}/`;
      }
      return `${canonicalOrigin}${canonicalBasePath}/${rel.slice(0, -'.html'.length)}`;
    }

    const htmlFiles = getAllFiles(finalDocsDir).filter((f) => f.endsWith('.html'));
    const canonicalUrls = [];

    // canonical 由页面头部管理；后处理只校验，避免破坏客户端导航时的同步。
    for (const htmlPath of htmlFiles) {
      const rel = path.relative(finalDocsDir, htmlPath).split(path.sep).join('/');
      const content = fs.readFileSync(htmlPath, 'utf8');
      const head = content.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
      if (head === undefined) {
        throw new Error(`页面缺少 <head>: ${rel}`);
      }
      const found = [...head.matchAll(/<link\b[^>]*>/gi)]
        .map((m) => m[0])
        .filter((tag) => /\brel=["']canonical["']/i.test(tag))
        .map((tag) => tag.match(/\bhref=["']([^"']*)["']/i)?.[1]);
      const expected = rel === '404.html' ? [] : [canonicalUrlFor(htmlPath)];
      if (found.length !== expected.length || found.some((u, i) => u !== expected[i])) {
        throw new Error(`canonical 自检失败 ${rel}: 期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(found)}`);
      }
      canonicalUrls.push(...found);
    }
    console.log(`   ✅ ${canonicalUrls.length} 个内容页各含 1 个 canonical，404.html 不含，全部与预期规范 URL 一致`);

    console.log('🗺️ [SEO 2/2] 正在生成 sitemap.xml...');
    const lastmod = new Date().toISOString().slice(0, 10);
    const items = canonicalUrls
      .slice()
      .sort()
      .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
      .join('\n');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
    fs.writeFileSync(path.join(finalDocsDir, 'sitemap.xml'), sitemap, 'utf8');
    console.log(`   ✅ out/docs/sitemap.xml 已生成，包含 ${canonicalUrls.length} 个 URL`);

    console.log('\n✨ 完美通关：单一权威产物已回填至 out/docs 目录！');
    console.log('👉 本地预览请运行: npm run preview\n');

  } catch (error) {
    console.error('❌ 失败，请检查以下错误：\n', error);
    process.exitCode = 1;
  }
}

main();
