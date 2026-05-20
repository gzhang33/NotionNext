import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'

const SearchInput = ({ keyword, cRef, className }) => {
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
  const lockRef = useRef(false)
  useImperativeHandle(cRef, () => ({
    focus: () => searchInputRef?.current?.focus()
  }))

  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      setLoadingState(true)
      location.href = '/search/' + key
    } else {
      router.push({ pathname: '/' })
    }
  }

  const handleKeyUp = e => {
    if (e.keyCode === 13) handleSearch()
    else if (e.keyCode === 27) cleanSearch()
  }

  const cleanSearch = () => { searchInputRef.current.value = '' }

  const [showClean, setShowClean] = useState(false)
  const updateSearchKey = val => {
    if (lockRef.current) return
    searchInputRef.current.value = val
    setShowClean(!!val)
  }

  return (
    <div className={`gianni-glass-input flex w-full overflow-hidden ${className || ''}`}>
      <input
        ref={searchInputRef}
        type='text'
        className='outline-none w-full text-sm pl-4 leading-10 bg-transparent'
        style={{ color: 'var(--text)' }}
        onKeyUp={handleKeyUp}
        onCompositionStart={() => { lockRef.current = true }}
        onCompositionUpdate={() => { lockRef.current = true }}
        onCompositionEnd={() => { lockRef.current = false }}
        onChange={e => updateSearchKey(e.target.value)}
        defaultValue={keyword}
      />
      <div className='flex items-center gap-1 px-3'>
        {showClean && (
          <button onClick={cleanSearch} className='cursor-pointer' aria-label='Clear'>
            <i className='fas fa-times gianni-search-icon' style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }} />
          </button>
        )}
        <button onClick={handleSearch} className='cursor-pointer' aria-label='Search'>
          <i className={`fas ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'} gianni-search-icon`}
            style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }} />
        </button>
      </div>
    </div>
  )
}

export default SearchInput
