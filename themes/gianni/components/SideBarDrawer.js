import { useRouter } from 'next/router'
import { useEffect } from 'react'
import SideBar from './SideBar'

const SideBarDrawer = ({ isOpen, onClose, ...sidebarProps }) => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => onClose()
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className='gianni-drawer-backdrop' onClick={onClose} />
      <div className='gianni-drawer' style={{ transform: 'translateX(0)' }}>
        <SideBar {...sidebarProps} />
      </div>
    </>
  )
}

export default SideBarDrawer
