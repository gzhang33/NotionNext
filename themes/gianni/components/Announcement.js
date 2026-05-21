import dynamic from 'next/dynamic'
import { useGlobal } from '@/lib/global'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post }) => {
  const { locale } = useGlobal()
  if (!post || !post.blockMap) return <></>

  return (
    <div className='gianni-sidebar-widget'>
      <div className='gianni-section-title'>
        <i className='fas fa-bullhorn mr-1' />
        {locale.COMMON.ANNOUNCEMENT}
      </div>
      <div className='overflow-y-auto' style={{ maxHeight: '200px', scrollbarWidth: 'thin' }}>
        <NotionPage post={post} />
      </div>
    </div>
  )
}

export default Announcement
