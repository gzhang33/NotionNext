import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import DarkModeButton from '@/components/DarkModeButton'
import CONFIG from '../config'
import { useRouter } from 'next/router'

export default function Header(props) {
  const router = useRouter()
  const isHome = router.pathname === '/' || router.pathname === '/page/[page]'
  const mainSite = siteConfig('LINK')

  const navLinks = [
    { label: 'About', href: `${mainSite}#about` },
    { label: 'Projects', href: `${mainSite}#projects` },
    { label: 'Blog', href: '/', active: isHome },
    { label: 'Contact', href: `${mainSite}#contact` }
  ]

  return (
    <header className="sticky top-0 z-50 py-3 px-6 flex justify-center">
      <div className="gianni-navbar-inner py-2.5 px-6 flex items-center gap-6 max-w-[680px] w-full">
        <SmartLink
          href="/"
          className="shrink-0"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '-0.02em',
            color: 'var(--text)'
          }}>
          {siteConfig('AUTHOR')}
        </SmartLink>

        <div className="flex-1" />

        <nav className="flex items-center gap-4">
          {navLinks.map(link => (
            <SmartLink
              key={link.label}
              href={link.href}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: link.active ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'color 200ms'
              }}>
              {link.label}
            </SmartLink>
          ))}
        </nav>

        <DarkModeButton />
      </div>
    </header>
  )
}
