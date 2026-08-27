import { useEffect, useRef, useState } from 'react'

function resolveSource(src) {
  if (src.startsWith('http') || src.startsWith('/docs')) {
    return src
  }

  return src.startsWith('/')
    ? `/docs${src}`
    : `/docs/videos/${src}`
}

function getDarkSource(src) {
  return src.replace(/(\.[\w\d_-]+)([?#].*)?$/i, '_dark$1$2')
}

export default function ThemeVideo({
  src,
  ariaLabel,
  className,
  style,
  autoPlay = true,
  controls = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'metadata'
}) {
  const videoRef = useRef(null)
  const [isDark, setIsDark] = useState(false)
  const [themeReady, setThemeReady] = useState(false)
  const [darkFailed, setDarkFailed] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true)

  const cleanSrc = resolveSource(src)
  const darkSrc = getDarkSource(cleanSrc)
  const finalSrc = isDark && !darkFailed ? darkSrc : cleanSrc
  const shouldAutoPlay = autoPlay && !prefersReducedMotion

  useEffect(() => {
    const root = document.documentElement
    const updateTheme = () => {
      setIsDark(root.classList.contains('dark'))
      setThemeReady(true)
    }
    const observer = new MutationObserver(updateTheme)

    updateTheme()
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    setDarkFailed(false)
  }, [cleanSrc, isDark])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (shouldAutoPlay) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [finalSrc, shouldAutoPlay])

  const handleError = () => {
    if (isDark && finalSrc === darkSrc) {
      setDarkFailed(true)
    }
  }

  if (!themeReady) return null

  return (
    <video
      key={finalSrc}
      ref={videoRef}
      src={finalSrc}
      aria-label={ariaLabel}
      autoPlay={shouldAutoPlay}
      controls={controls || prefersReducedMotion}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      className={className}
      style={{ display: 'block', maxWidth: '100%', height: 'auto', ...style }}
      onError={handleError}
    >
      您的浏览器不支持视频播放。
    </video>
  )
}
