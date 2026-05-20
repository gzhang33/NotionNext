import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)

  useEffect(() => {
    const scrollListener = () => {
      const shouldShow = window.pageYOffset > 200
      if (shouldShow !== show) switchShow(shouldShow)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [show])

  return (
    <div
      title={locale.POST?.TOP}
      className={(show ? 'opacity-100' : 'invisible opacity-0') + ' transition-all duration-300 flex items-center justify-center cursor-pointer h-8 w-8 rounded-full'}
      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <i className='fas fa-angle-up text-xs' style={{ color: 'var(--text-secondary)' }} />
    </div>
  )
}

export default JumpToTopButton
