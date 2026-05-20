import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGianniGlobal } from '..'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

export default function NavBar(props) {
  const [showSearchInput, setShowSearchInput] = useState(false)
  const router = useRouter()
  const { searchModal } = useGianniGlobal()

  const toggleSearch = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
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
    { label: 'Latest', href: '/', show: true },
    { label: 'Archive', href: '/archive', show: siteConfig('GIANNI_MENU_ARCHIVE', null, CONFIG) },
    { label: 'Tags', href: '/tags', show: siteConfig('GIANNI_MENU_TAG', null, CONFIG) },
    { label: 'Categories', href: '/category', show: siteConfig('GIANNI_MENU_CATEGORY', null, CONFIG) }
  ].filter(p => p.show)

  const isActive = href => {
    const path = router.pathname
    if (href === '/') return path === '/' || path === '/page/[page]'
    return path.startsWith(href)
  }

  return (
    <div className='max-w-[1100px] mx-auto mt-7 px-8 flex gap-2 flex-wrap items-center'>
      {pills.map(pill => (
        <SmartLink
          key={pill.href}
          href={pill.href}
          className={`gianni-pill${isActive(pill.href) ? ' active' : ''}`}>
          {pill.label}
        </SmartLink>
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
          placeholder='Type then hit enter to search...'
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
