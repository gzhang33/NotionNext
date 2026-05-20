import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { useGianniGlobal } from '..'

const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/' },
  { label: 'Contact', href: '/#contact' }
]

export default function Header() {
  const router = useRouter()
  const isHome = router.pathname === '/' || router.pathname === '/page/[page]'
  const { mobileNavOpen, setMobileNavOpen } = useGianniGlobal() || {}

  const [activeSection, setActiveSection] = useState(isHome ? '' : null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // IntersectionObserver for hash-based active section (only on home)
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null)
      return
    }

    const sectionIds = NAV_ITEMS
      .filter(item => item.href.startsWith('/#'))
      .map(item => item.href.replace('/#', ''))

    const timer = setTimeout(() => {
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean)

      if (sections.length === 0) return

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        { rootMargin: '-40% 0px -50% 0px' }
      )

      sections.forEach(s => observer.observe(s))

      const handleScroll = () => {
        const y = window.scrollY
        const nearBottom = window.innerHeight + y >= document.body.scrollHeight - 80
        if (nearBottom) setActiveSection('contact')
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.__gianniScrollHandler = handleScroll
      window.__gianniObserver = observer
    }, 100)

    return () => {
      clearTimeout(timer)
      if (window.__gianniScrollHandler) {
        window.removeEventListener('scroll', window.__gianniScrollHandler)
        window.__gianniScrollHandler = null
      }
      if (window.__gianniObserver) {
        window.__gianniObserver.disconnect()
        window.__gianniObserver = null
      }
    }
  }, [isHome])

  const handleNavClick = useCallback((e, href) => {
    if (href === '/') {
      setMobileNavOpen?.(false)
      return
    }

    if (href.startsWith('/#')) {
      e.preventDefault()
      setMobileNavOpen?.(false)

      if (isHome) {
        const el = document.getElementById(href.replace('/#', ''))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(href.replace('/#', ''))
      } else {
        // Force full page navigation to leave the NotionNext SPA
        // Next.js client router would otherwise intercept <a href="/">
        window.location.href = href
      }
    }
  }, [isHome, setMobileNavOpen])

  const isItemActive = item => {
    if (!mounted) return false
    if (item.href === '/') {
      return !isHome ? false : activeSection === '' && router.pathname === '/'
    }
    if (item.href.startsWith('/#')) {
      return isHome && activeSection === item.href.replace('/#', '')
    }
    return router.pathname.startsWith(item.href)
  }

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
      >
        <nav
          aria-label="Main navigation"
          className="gianni-nav-pill w-full max-w-[680px] min-h-[4rem] px-4 sm:px-2 py-2 sm:py-1.5 flex items-center justify-between"
        >
          <SmartLink
            href="/"
            onClick={e => {
              if (isHome) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="shrink-0 pl-1 sm:pl-4 py-2.5 gianni-nav-logo"
            aria-label="Scroll to top"
          >
            Gianni<span className="gianni-nav-dot">.</span>
          </SmartLink>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const active = isItemActive(item)
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={e => handleNavClick(e, item.href)}
                  className={`gianni-nav-link ${active ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          <button
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full gianni-hamburger"
            onClick={() => setMobileNavOpen?.(!mobileNavOpen)}
            aria-label="Toggle Menu"
          >
            <span className="gianni-hamburger-icon">{mobileNavOpen ? '✕' : '☰'}</span>
          </button>
        </nav>
      </div>

      {mobileNavOpen && (
        <div className="gianni-mobile-fullscreen-backdrop z-[60] md:hidden flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {NAV_ITEMS.map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={e => handleNavClick(e, item.href)}
                className="gianni-mobile-fullscreen-link"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="h-[72px]" />
    </>
  )
}
