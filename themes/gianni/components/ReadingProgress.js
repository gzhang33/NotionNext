import { useEffect, useState } from 'react'
import { isBrowser } from '@/lib/utils'

export default function ReadingProgress({ targetRef }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let requestId = null

    const update = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollY = window.scrollY || window.pageYOffset
      const maxScroll = scrollHeight - clientHeight
      const p = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0
      setPercent(p)
      requestId = null
    }

    const onScroll = () => {
      if (requestId) return
      requestId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (requestId) cancelAnimationFrame(requestId)
    }
  }, [])

  if (percent <= 0) return null

  return (
    <div
      className='gianni-reading-progress'
      style={{ width: `${percent}%` }}
    />
  )
}
