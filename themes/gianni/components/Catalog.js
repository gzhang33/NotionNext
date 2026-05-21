import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'
import { useGlobal } from '@/lib/global'

const Catalog = ({ post }) => {
  const { locale } = useGlobal()
  const tRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    let throttleTimer = null
    const throttleMs = 200

    const actionSectionScrollSpy = () => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      const index = post?.toc?.findIndex(obj => uuidToId(obj.id) === currentSectionId)
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }

    const onScroll = () => {
      if (throttleTimer) return
      throttleTimer = setTimeout(() => {
        throttleTimer = null
        actionSectionScrollSpy()
      }, throttleMs)
    }

    window.addEventListener('scroll', onScroll)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (throttleTimer) clearTimeout(throttleTimer)
    }
  }, [post])

  if (!post || !post?.toc || post?.toc?.length < 1) return <></>

  return (
    <div className='gianni-sidebar-widget'>
      <div className='text-[10px] uppercase tracking-wider mb-2 font-medium' style={{ color: 'var(--text-muted)' }}>
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>
      <div
        className='overflow-y-auto overscroll-none max-h-64'
        style={{ scrollbarWidth: 'thin' }}
        ref={tRef}>
        <nav className='h-full'>
          {post?.toc?.map(tocItem => {
            const id = uuidToId(tocItem.id)
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`gianni-toc-item${activeSection === id ? ' active' : ''}`}
                style={{ paddingLeft: `${12 + tocItem.indentLevel * 12}px` }}>
                {tocItem.text}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
