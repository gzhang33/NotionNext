import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
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

export default function MobileNav({ isOpen, onClose }) {
  const router = useRouter()
  const isHome = router.pathname === '/' || router.pathname === '/page/[page]'
  const { mobileNavOpen, setMobileNavOpen } = useGianniGlobal() || {}

  // Close on route change
  useEffect(() => {
    const handleRouteChange = () => onClose?.()
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const onEscape = e => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [isOpen, onClose])

  const handleNavClick = (e, href) => {
    if (href.startsWith('#') && isHome) {
      e.preventDefault()
      const el = document.getElementById(href.replace('#', ''))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 gianni-mobile-fullscreen-backdrop z-[60] md:hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
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
  )
}
