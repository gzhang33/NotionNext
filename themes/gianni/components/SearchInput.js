import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'

let lock = false

const SearchInput = ({ keyword, cRef, className }) => {
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
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
    if (lock) return
    searchInputRef.current.value = val
    setShowClean(!!val)
  }

  return (
    <div
      className={'flex w-full rounded-lg overflow-hidden ' + className}
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <input
        ref={searchInputRef}
        type='text'
        className='outline-none w-full text-sm pl-3 leading-10 bg-transparent'
        style={{ color: 'var(--text)' }}
        onKeyUp={handleKeyUp}
        onCompositionStart={() => { lock = true }}
        onCompositionUpdate={() => { lock = true }}
        onCompositionEnd={() => { lock = false }}
        onChange={e => updateSearchKey(e.target.value)}
        defaultValue={keyword}
      />
      <div className='-ml-8 cursor-pointer flex items-center justify-center px-2' onClick={handleSearch}>
        <i className={`fas ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'}`} style={{ color: 'var(--text-muted)' }} />
      </div>
      {showClean && (
        <div className='-ml-8 cursor-pointer flex items-center justify-center px-2' onClick={cleanSearch}>
          <i className='fas fa-times' style={{ color: 'var(--text-muted)' }} />
        </div>
      )}
    </div>
  )
}

export default SearchInput
