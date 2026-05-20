import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import DarkModeButton from '@/components/DarkModeButton'
import CONFIG from '../config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useGianniGlobal } from '..'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '/' },
  { label: 'Contact', href: '#contact' }
]

export default function Header(props) {
  const router = useRouter()
  const isHome = router.pathname === '/' || router.pathname === '/page/[page]'
  const { mobileNavOpen, setMobileNavOpen } = useGianniGlobal() || {}

  const [activeSection, setActiveSection] = useState('')
  const [scrollY, setScrollY] = useState(0)

  // IntersectionObserver for hash-based active section (only on home)
  useEffect(() => {
    if (!isHome) return

    const sectionIds = NAV_ITEMS
      .filter(item => item.href.startsWith('#'))
      .map(item => item.href.replace('#', ''))

    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean)

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

    const handleScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      const nearBottom = window.innerHeight + y >= document.body.scrollHeight - 80
      if (nearBottom) setActiveSection('contact')
    }

    sections.forEach(s => observer.observe(s))
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isHome])

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      // Hash links: scroll on home, navigate to home#hash from other pages
      if (isHome) {
        e.preventDefault()
        const el = document.getElementById(href.replace('#', ''))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileNavOpen?.(false)
    } else {
      setMobileNavOpen?.(false)
    }
  }

  const isItemActive = item => {
    if (item.href === '/') {
      return !isHome ? false : activeSection === '' && router.pathname === '/'
    }
    if (item.href.startsWith('#')) {
      const sectionId = item.href.replace('#', '')
      return isHome && activeSection === sectionId
    }
    return router.pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Desktop + Mobile floating pill navbar */}
      <div
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
      >
        <nav
          aria-label="Main navigation"
          className="gianni-nav-pill w-full max-w-[680px] min-h-[4rem] px-4 sm:px-2 py-2 sm:py-1.5 flex items-center justify-between"
        >
          {/* Logo */}
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

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const active = isItemActive(item)
              return (
                <SmartLink
                  key={item.label}
                  href={item.href}
                  onClick={e => handleNavClick(e, item.href)}
                  className={`gianni-nav-link ${active ? 'active' : ''}`}
                >
                  {item.label}
                </SmartLink>
              )
            })}
          </div>

          {/* Dark mode toggle */}
          <DarkModeButton className="hidden md:flex mr-1" />

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full gianni-hamburger"
            onClick={() => setMobileNavOpen?.(!mobileNavOpen)}
            aria-label="Toggle Menu"
          >
            <span className="gianni-hamburger-icon">{mobileNavOpen ? '✕' : '☰'}</span>
          </button>
        </nav>
      </div>

      {/* Mobile fullscreen overlay */}
      {mobileNavOpen && (
        <div className="gianni-mobile-fullscreen md:hidden">
          <div className="gianni-mobile-fullscreen-links">
            {NAV_ITEMS.map(item => (
              <SmartLink
                key={item.label}
                href={item.href}
                onClick={e => handleNavClick(e, item.href)}
                className="gianni-mobile-fullscreen-link"
              >
                {item.label}
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      {/* Spacer so content isn't hidden behind fixed nav */}
      <div className="h-[72px]" />
    </>
  )
}
