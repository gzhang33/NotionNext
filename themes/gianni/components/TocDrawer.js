import { uuidToId } from 'notion-utils'
import { useEffect, useImperativeHandle, useState } from 'react'
import { useGlobal } from '@/lib/global'

const TocDrawer = ({ post, cRef }) => {
  const { locale } = useGlobal()
  const [showDrawer, setShowDrawer] = useState(false)

  useImperativeHandle(cRef, () => ({
    handleSwitchVisible: () => setShowDrawer(prev => !prev)
  }))

  useEffect(() => {
    if (!showDrawer) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowDrawer(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showDrawer])

  if (!post || !post.toc || post.toc.length < 2) return null

  const handleClose = () => setShowDrawer(false)

  return (
    <>
      {showDrawer && (
        <div className='gianni-drawer-backdrop' onClick={handleClose} />
      )}
      <div
        className='gianni-drawer'
        style={{ transform: showDrawer ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className='text-[10px] uppercase tracking-wider mb-3 font-medium' style={{ color: 'var(--text-muted)' }}>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
        <nav>
          {post.toc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            return (
              <a
                key={id}
                href={`#${id}`}
                className='gianni-toc-item'
                style={{ paddingLeft: `${12 + tocItem.indentLevel * 12}px` }}
                onClick={handleClose}>
                {tocItem.text}
              </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default TocDrawer
