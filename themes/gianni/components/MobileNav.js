import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGianniGlobal } from '..'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '/' },
  { label: 'Contact', href: '#contact' }
]

export default function MobileNav({ isOpen, onClose }) {
  const router = useRouter()
  const isHome = router.pathname === '/' || router.pathname === '/page/[page]'
  const mainSite = siteConfig('LINK')

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
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onEscape = e => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [isOpen, onClose])

  const handleNavClick = (e, href) => {
    onClose?.()

    if (href === '/') return

    if (href.startsWith('#') && isHome) {
      e.preventDefault()
      const el = document.getElementById(href.replace('#', ''))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    // On non-home, let the <a> tag's href (mainSite + hash) handle navigation natively
  }

  const resolveHref = href => {
    if (href === '/') return href
    if (href.startsWith('#')) return isHome ? href : mainSite + href
    return href
  }

  if (!isOpen) return null

  return (
    <div className="gianni-mobile-fullscreen-backdrop z-[60] md:hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={resolveHref(item.href)}
            onClick={e => handleNavClick(e, item.href)}
            className="gianni-mobile-fullscreen-link"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
