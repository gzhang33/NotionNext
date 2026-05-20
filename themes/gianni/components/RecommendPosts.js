import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

const RecommendPosts = ({ recommendPosts }) => {
  const { locale } = useGlobal()
  if (!siteConfig('GIANNI_ARTICLE_RECOMMEND_POSTS', null, CONFIG) || !recommendPosts || recommendPosts.length < 1) {
    return <></>
  }

  return (
    <div className='gianni-sidebar-widget my-4'>
      <div className='text-[10px] uppercase tracking-wider mb-2 font-medium' style={{ color: 'var(--text-muted)' }}>
        {locale.COMMON.RELATE_POSTS}
      </div>
      <ul className='space-y-1'>
        {recommendPosts.map(post => (
          <li key={post.id}>
            <SmartLink
              href={`/${post.slug}`}
              className='text-[11px] block py-0.5 transition-colors duration-200'
              style={{ color: 'var(--text-secondary)' }}>
              {post.title}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default RecommendPosts
