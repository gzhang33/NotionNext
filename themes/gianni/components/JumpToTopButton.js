import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    let requestId = null

    const update = () => {
      const y = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const p = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0
      setScrollPercent(Math.min(100, Math.max(0, p)))
      switchShow(y > 200)
      requestId = null
    }

    const onScroll = () => {
      if (requestId) return
      requestId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (requestId) cancelAnimationFrame(requestId)
    }
  }, [])

  const scrollToTop = () => {
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
  }

  return (
    <div
      title={locale.POST?.TOP}
      className={(show ? 'opacity-100' : 'invisible opacity-0') + ' transition-all duration-300 flex items-center justify-center cursor-pointer h-8 w-8 rounded-full'}
      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}
      onClick={scrollToTop}>
      {scrollPercent >= 100 ? (
        <i className='fas fa-angle-up text-xs' style={{ color: 'var(--accent)' }} />
      ) : (
        <span className='text-[8px] font-mono' style={{ color: 'var(--text-secondary)' }}>
          {scrollPercent}
        </span>
      )}
    </div>
  )
}

export default JumpToTopButton
