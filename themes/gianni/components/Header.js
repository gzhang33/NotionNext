import SmartLink from '@/components/SmartLink'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { useEffect, useState, useCallback } from 'react'
import { useGianniGlobal } from '..'
import { siteConfig } from '@/lib/config'
import {
  MAIN_NAV_ITEMS,
  PERSONAL_SITE_URL,
  getBlogHomeHref,
  getPersonalSectionHref,
  isBlogHomePath
} from '../navigation'

export default function Header() {
  const { mobileNavOpen, setMobileNavOpen } = useGianniGlobal() || {}
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
    setMounted(true)
  }, [])
  const handleHomeClick = useCallback(
    e => {
      setMobileNavOpen?.(false)
      if (realIsHome) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [realIsHome, setMobileNavOpen]
  )

  const isItemActive = item => {
    return mounted && item.kind === 'blog'
  }

  const getItemHref = item => {
    if (item.kind === 'blog') {
      return blogHomeHref
    }
    return getPersonalSectionHref(siteUrl, item.sectionId)
  }

  return (
    <>
      <div
        className='fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4'
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
      >
        <nav
          aria-label='Main navigation'
          className='gianni-nav-pill pointer-events-auto h-[3.25rem] w-full max-w-[680px] px-3 sm:px-2.5 flex items-center justify-between'
        >
          {blogHomeHref === '/blog' ? (
            <a
              href={blogHomeHref}
              onClick={handleHomeClick}
              className='shrink-0 pl-1 sm:pl-3.5 py-1.5 gianni-nav-logo'
              aria-label='Scroll to top'
            >
              Gianni<span className='gianni-nav-dot'>.</span>
            </a>
          ) : (
            <SmartLink
              href={blogHomeHref}
              onClick={handleHomeClick}
              className='shrink-0 pl-1 sm:pl-3.5 py-1.5 gianni-nav-logo'
              aria-label='Scroll to top'
            >
              Gianni<span className='gianni-nav-dot'>.</span>
            </SmartLink>
          )}

          <div className='hidden md:flex items-center gap-1'>
            {MAIN_NAV_ITEMS.map(item => {
              const active = isItemActive(item)
              const href = getItemHref(item)
              return (
                <a
                  key={item.label}
                  href={href}
                  onClick={
                    item.kind === 'blog'
                      ? handleHomeClick
                      : () => setMobileNavOpen?.(false)
                  }
                  className={`gianni-nav-link ${active ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          <button
            className='md:hidden flex h-10 w-10 items-center justify-center rounded-full gianni-hamburger'
            onClick={() => setMobileNavOpen?.(!mobileNavOpen)}
            aria-label='Toggle Menu'
          >
            {mobileNavOpen ? (
              <IconX size={20} stroke={1.8} />
            ) : (
              <IconMenu2 size={20} stroke={1.8} />
            )}
          </button>
        </nav>
      </div>

      <div className='h-[60px] sm:h-[64px]' />
    </>
  )
}
