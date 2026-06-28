import { useState } from 'react'
import Image from 'next/image'

export default function ThemeImage({ src, alt, width, height, className, style }) {
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
      <Image
        src={cleanSrc}
        alt={alt}
        width={width}
        height={height}
        className={`img-light-mode ${className || ''}`}
        style={{ maxWidth: '100%', height: 'auto', ...style }}
      />
      <Image
        src={finalDarkSrc}
        alt={alt}
        width={width}
        height={height}
        className={`img-dark-mode ${className || ''}`}
        style={{ maxWidth: '100%', height: 'auto', ...style }}
        onError={() => setDarkFailed(true)}
      />
    </>
  );
}



/*

import ThemeImage from '../components/ThemeImage'

<ThemeImage 
  src="/docs/images/docs/index/scientific.png" 
  alt="公式推导图"
  width={1200} 
  height={800} 
  style = {{ maxWidth: '300px', height: 'auto',borderRadius: '12px', marginTop: '16px' }}
/>


*/

/*

<ThemeImage
  srcLight="/docs/images/formula-light.png"
  srcDark="/docs/images/formula-dark.png"
  alt="名字"
  width={1200}
  height={800}
  style={{
    maxWidth: '400px',
    height: 'auto',
    borderRadius: '12px',
    marginTop: '16px'
  }}
/>

*/