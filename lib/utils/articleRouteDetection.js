/**
 * 判断客户端跳转路径是否为「两段式文章详情」风格（/[prefix]/[slug] 及其带 locale、后缀变体）。
 * 用于在路由切换时展示文章骨架屏，避免主题先隐藏内容后出现空白。
 */

const STATIC_FIRST_SEGMENTS = new Set([
  'archive',
  'category',
  'tag',
  'search',
  'auth',
  'page',
  'dashboard',
  'sign-in',
  'sign-up',
  'api',
  '_next',
  'rss',
  'fonts',
  'feed',
  'og',
  'sitemap.xml'
])

/**
 * @param {string} pathname - e.g. /zh-CN/article/hello or /article/hello
 * @returns {boolean}
 */
export function isArticleDetailNavigationPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return false
  const path = pathname.split('?')[0]
  let segments = path.split('/').filter(Boolean)
  if (segments.length < 2) return false

  // Next.js i18n：第一段常为 zh-CN、en 等
  if (
    segments.length >= 3 &&
    /^[a-z]{2}(-[a-zA-Z0-9]{2,})?$/.test(segments[0])
  ) {
    segments = segments.slice(1)
  }

  if (segments.length < 2) return false

  const first = segments[0]
  if (STATIC_FIRST_SEGMENTS.has(first)) return false

  return true
}
