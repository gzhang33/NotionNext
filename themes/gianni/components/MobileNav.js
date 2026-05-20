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
    onClose?.()

    if (href === '/') return // Let Next.js handle

    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.replace('#', '')

      if (isHome) {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push('/' + href).then(() => {
          setTimeout(() => {
            const el = document.getElementById(targetId)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }, 300)
        })
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="gianni-mobile-fullscreen-backdrop z-[60] md:hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={item.href.startsWith('#') && !isHome ? '/' + item.href : item.href}
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
