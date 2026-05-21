function trimTrailingSlash(url = '') {
  return url.replace(/\/+$/, '')
}

function stripQueryAndHash(path = '') {
  return path.split(/[?#]/)[0] || '/'
}

export const MAIN_NAV_ITEMS = [
  { label: 'About', kind: 'personal', sectionId: 'about' },
  { label: 'Projects', kind: 'personal', sectionId: 'projects' },
  { label: 'Blog', kind: 'blog' },
  { label: 'Contact', kind: 'personal', sectionId: 'contact' }
]

export const PERSONAL_SITE_URL = (
  process.env.NEXT_PUBLIC_LINK || ''
).trim()

export function getPersonalSectionHref(siteUrl, sectionId) {
  return `${trimTrailingSlash(siteUrl)}/#${sectionId}`
}

export function getBlogHomeHref(siteUrl, currentOrigin) {
  try {
    const personalOrigin = new URL(trimTrailingSlash(siteUrl)).origin
    return personalOrigin === currentOrigin ? '/blog' : '/'
  } catch (error) {
    return '/'
  }
}

export function isBlogHomePath(path) {
  const cleanPath = stripQueryAndHash(path)

  return (
    cleanPath === '/' ||
    cleanPath === '/blog' ||
    cleanPath.startsWith('/page/') ||
    cleanPath.startsWith('/blog/page/')
  )
}
