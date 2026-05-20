import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { BlogItem } from './BlogItem'

export default function BlogListScroll(props) {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)

  return (
    <div id='posts-wrapper' className='w-full mb-12'>
      {posts?.slice(0, POSTS_PER_PAGE).map(p => (
        <BlogItem key={p.id} post={p} />
      ))}
    </div>
  )
}
