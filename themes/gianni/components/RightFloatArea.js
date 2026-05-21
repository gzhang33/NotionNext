import { useCallback, useEffect, useState } from 'react'
import TocDrawerButton from './TocDrawerButton'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const RightFloatArea = ({ post, floatSlot, onToggleToc, onToggleSidebar }) => {
  const [show, setShow] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    let rafId = null

    const update = () => {
      const y = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const p = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0
      setScrollPercent(Math.min(100, Math.max(0, p)))
      setShow(y > 200)
      rafId = null
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    const startY = window.scrollY
    const duration = 400
    const start = performance.now()

    const animate = now => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutQuad(progress)
      window.scrollTo(0, startY * (1 - eased))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [])

  const scrollToComment = useCallback(() => {
    const el = document.getElementById('comment')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const showCommentBtn = post && siteConfig('GIANNI_ARTICLE_JUMP_TO_COMMENT', null, CONFIG)

  return (
    <div
      className={`fixed bottom-4 right-4 z-20 flex flex-col gap-2 transition-all duration-300 ${
        show ? 'opacity-100' : 'opacity-0 invisible'
      }`}>
      {/* TOC button - mobile only */}
      {post?.toc?.length > 1 && (
        <div className='lg:hidden'>
          <TocDrawerButton onClick={onToggleToc} />
        </div>
      )}

      {/* Sidebar button - mobile only, non-post pages */}
      {!post && (
        <div className='lg:hidden'>
          <button
            className='gianni-float-btn'
            onClick={onToggleSidebar}
            aria-label='Toggle sidebar'>
            <i className='fas fa-bars text-xs' />
          </button>
        </div>
      )}

      {/* Jump to comment */}
      {showCommentBtn && (
        <button
          className='gianni-float-btn'
          onClick={scrollToComment}
          aria-label='Jump to comment'>
          <i className='fa-regular fa-comment text-xs' />
        </button>
      )}

      {/* Back to top */}
      <button
        className='gianni-float-btn'
        onClick={scrollToTop}
        aria-label='Back to top'>
        {scrollPercent >= 100 ? (
          <i className='fas fa-angle-up text-xs' style={{ color: 'var(--accent)' }} />
        ) : (
          <span className='text-[8px] font-mono' style={{ color: 'var(--text-secondary)' }}>
            {scrollPercent}
          </span>
        )}
      </button>

      {floatSlot}
    </div>
  )
}

export default RightFloatArea
