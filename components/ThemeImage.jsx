import { useState } from 'react'

export default function ThemeImage({ src, alt, className, style }) {
  let cleanSrc = src;
  if (!src.startsWith('http') && !src.startsWith('/docs')) {
    cleanSrc = src.startsWith('/')
      ? `/docs${src}`
      : `/docs/images/${src}`;
  }

  // 自动推断 _dark 路径
  const autoDarkSrc = cleanSrc.replace(/(\.[\w\d_-]+)$/i, '_dark$1');

  // 暗色图加载失败容错降级
  const [darkFailed, setDarkFailed] = useState(false);
  const finalDarkSrc = darkFailed ? cleanSrc : autoDarkSrc;

  return (
    <>
      <img
        src={cleanSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`img-light-mode ${className || ''}`}
        style={{ maxWidth: '100%', height: 'auto', ...style }}
      />
      <img
        src={finalDarkSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`img-dark-mode ${className || ''}`}
        style={{ maxWidth: '100%', height: 'auto', ...style }}
        onError={() => setDarkFailed(true)}
      />
    </>
  );
}
