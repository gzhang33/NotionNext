import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  MAIN_NAV_ITEMS,
  PERSONAL_SITE_URL,
  getBlogHomeHref,
  getPersonalSectionHref,
  isBlogHomePath
} from '../navigation'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export default function MobileNav({ isOpen, onClose }) {
  const router = useRouter()
  const { locale } = useGlobal()
  const [mounted, setMounted] = useState(false)
  const siteUrl = PERSONAL_SITE_URL
  const currentPath =
    mounted && typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : ''
  const currentOrigin =
    mounted && typeof window !== 'undefined' ? window.location.origin : ''
  const realIsHome = isBlogHomePath(currentPath)
  const blogHomeHref = getBlogHomeHref(siteUrl, currentOrigin)

  useEffect(() => {
    const handleRouteChange = () => onClose?.()
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onEscape = e => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [isOpen, onClose])

  const handleNavClick = (e, href) => {
    onClose?.()

    if (href === blogHomeHref && realIsHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getItemHref = item => {
    if (item.kind === 'blog') {
      return blogHomeHref
    }
    return getPersonalSectionHref(siteUrl, item.sectionId)
  }

  if (!isOpen) return null

  return (
    <div className='gianni-mobile-fullscreen-backdrop z-[60] md:hidden flex items-center justify-center'>
      <div className='flex flex-col items-center gap-8'>
        {MAIN_NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={getItemHref(item)}
            onClick={e => handleNavClick(e, getItemHref(item))}
            className='gianni-mobile-fullscreen-link'
          >
            {item.label}
          </a>
        ))}

        {siteConfig('GIANNI_MOBILE_BLOG_PILLS', null, CONFIG) && (
          <>
            <div style={{ width: 40, height: 1, background: 'var(--divider)' }} />

            <div className='gianni-mobile-pills'>
              {blogHomeHref === '/blog' ? (
                <a
                  href={blogHomeHref}
                  className={`gianni-pill${(router.pathname === '/' || router.pathname === '/blog' || router.pathname === '/page/[page]' || router.pathname === '/blog/page/[page]') ? ' active' : ''}`}
                >
                  {locale.COMMON.LATEST_POSTS}
                </a>
              ) : (
                <SmartLink
                  href={blogHomeHref}
                  className={`gianni-pill${(router.pathname === '/' || router.pathname === '/blog' || router.pathname === '/page/[page]' || router.pathname === '/blog/page/[page]') ? ' active' : ''}`}
                >
                  {locale.COMMON.LATEST_POSTS}
                </SmartLink>
              )}

              {siteConfig('GIANNI_MENU_ARCHIVE', null, CONFIG) && (
                <SmartLink
                  href='/archive'
                  className={`gianni-pill${router.pathname === '/archive' ? ' active' : ''}`}
                >
                  {locale.NAV.ARCHIVE}
                </SmartLink>
              )}

              {siteConfig('GIANNI_MENU_TAG', null, CONFIG) && (
                <SmartLink
                  href='/tag'
                  className={`gianni-pill${router.pathname.startsWith('/tag') ? ' active' : ''}`}
                >
                  {locale.COMMON.TAGS}
                </SmartLink>
              )}

              {siteConfig('GIANNI_MENU_CATEGORY', null, CONFIG) && (
                <SmartLink
                  href='/category'
                  className={`gianni-pill${router.pathname.startsWith('/category') ? ' active' : ''}`}
                >
                  {locale.COMMON.CATEGORY}
                </SmartLink>
              )}

              {siteConfig('GIANNI_MENU_SEARCH', null, CONFIG) && (
                <SmartLink
                  href='/search'
                  className={`gianni-pill${router.pathname.startsWith('/search') ? ' active' : ''}`}
                >
                  <i className='fa-solid fa-magnifying-glass' />
                </SmartLink>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
