import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 定义路径
const outDir = path.join(process.cwd(), 'out');
const releaseDir = path.join(process.cwd(), 'release');
const targetDocsDir = path.join(releaseDir, 'docs');

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

    console.log('📦 [1/3] 正在安全分离离线发行版...');
    if (fs.existsSync(releaseDir)) {
      fs.rmSync(releaseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDocsDir, { recursive: true });
    fs.cpSync(outDir, targetDocsDir, { recursive: true });

    // 获取 release/docs 下的所有文件
    const allFiles = getAllFiles(targetDocsDir);

    // 找出所有图片
    const imageFiles = allFiles.filter(f => /\.(png|jpe?g)$/i.test(f));

    if (imageFiles.length > 0) {
      console.log(`🖼️ [2/3] 引擎启动：拦截到 ${imageFiles.length} 张原图，正在极限压缩为 WebP...`);

      // 并发执行所有的图片压缩任务，榨干 CPU 性能
      await Promise.all(imageFiles.map(async (imgPath) => {
        const webpPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');
        // 使用 sharp 转换并输出
        await sharp(imgPath).webp({ quality: 80 }).toFile(webpPath);
        // 毁尸灭迹，删除原图
        fs.unlinkSync(imgPath);
      }));

      console.log(`📝 [3/3] 正在篡改底包：全局重定向图片引用...`);
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
      console.log(`🖼️ [2/3] 未检测到需要压缩的图片，跳过。`);
    }

    console.log('\n✨ 成功！已生成至 release/docs 目录。');

  } catch (error) {
    console.error('❌ 失败，请检查以下错误：\n', error);
  }
}

main();