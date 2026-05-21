import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useGianniGlobal } from '..'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'
import { PERSONAL_SITE_URL, getBlogHomeHref } from '../navigation'

export default function NavBar(props) {
  const { locale } = useGlobal()
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { searchModal } = useGianniGlobal()
  const currentOrigin =
    mounted && typeof window !== 'undefined' ? window.location.origin : ''
  const blogHomeHref = getBlogHomeHref(PERSONAL_SITE_URL, currentOrigin)

  useEffect(() => { setMounted(true) }, [])

  const toggleSearch = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal?.current?.openSearch?.()
    } else {
      setShowSearchInput(!showSearchInput)
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('gianni-nav-search').value
      if (search) router.push({ pathname: '/search/' + search })
    }
  }

  const pills = [
    { label: locale.COMMON.LATEST_POSTS, href: blogHomeHref, show: true },
    { label: locale.NAV.ARCHIVE, href: '/archive', show: siteConfig('GIANNI_MENU_ARCHIVE', null, CONFIG) },
    { label: locale.COMMON.TAGS, href: '/tag', show: siteConfig('GIANNI_MENU_TAG', null, CONFIG) },
    { label: locale.COMMON.CATEGORY, href: '/category', show: siteConfig('GIANNI_MENU_CATEGORY', null, CONFIG) }
  ].filter(p => p.show)

  const isActive = href => {
    const path = router.pathname
    if (href === '/' || href === '/blog') {
      return path === '/' || path === '/blog'
        || path === '/page/[page]' || path === '/blog/page/[page]'
    }
    return path.startsWith(href)
  }

  return (
    <div className='hidden md:flex max-w-[1100px] mx-auto mt-4 px-8 gap-2 flex-wrap items-center'>
      {pills.map(pill => (
        pill.href === '/blog' ? (
          <a
            key={pill.href}
            href={pill.href}
            className={`gianni-pill${isActive(pill.href) ? ' active' : ''}`}>
            {pill.label}
          </a>
        ) : (
          <SmartLink
            key={pill.href}
            href={pill.href}
            className={`gianni-pill${isActive(pill.href) ? ' active' : ''}`}>
            {pill.label}
          </SmartLink>
        )
      ))}

      {showSearchInput && (
        <input
          autoFocus
          id='gianni-nav-search'
          onKeyUp={onKeyUp}
          className='gianni-pill flex-1 min-w-[140px] outline-none bg-transparent'
          aria-label='Submit search'
          type='search'
          name='s'
          autoComplete='off'
          placeholder={locale.SEARCH.ARTICLES}
        />
      )}

      {siteConfig('GIANNI_MENU_SEARCH', null, CONFIG) && (
        <button
          onClick={toggleSearch}
          className='gianni-pill ml-auto flex items-center gap-1'
          aria-label='Search'>
          <i className={showSearchInput ? 'fa-regular fa-circle-xmark' : 'fa-solid fa-magnifying-glass'} />
        </button>
      )}
    </div>
  )
}
