import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import NotionIcon from '@/components/NotionIcon'
import CONFIG from '../config'

export default function ArticleInfo(props) {
  const { post } = props

  return (
    <section className='mb-6'>
      <h1
        className='blog-item-title text-2xl md:text-3xl font-bold leading-tight mb-3 no-underline'
        style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
        {post?.title}
      </h1>

      {post?.type !== 'Page' && (
        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]' style={{ color: 'var(--text-muted)' }}>
          <span>
            <i className='fa-regular fa-user mr-1' />
            <a href={siteConfig('SIMPLE_AUTHOR_LINK', null, CONFIG)} style={{ color: 'var(--text-secondary)' }}>
              {siteConfig('AUTHOR')}
            </a>
          </span>
          <span>
            <i className='fa-regular fa-clock mr-1' />
            {post?.publishDay}
          </span>
          {post?.category && (
            <span>
              <i className='fa-regular fa-folder mr-1' />
              <a href={`/category/${post?.category}`} style={{ color: 'var(--text-secondary)' }}>
                {post?.category}
              </a>
            </span>
          )}
          {post?.tags?.length > 0 && (
            <span className='flex items-center gap-1.5'>
              {post.tags.map(t => (
                <SmartLink key={t} href={`/tag/${t}`}>
                  <span className='text-[9px] px-2 py-0.5 rounded-full' style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    {t}
                  </span>
                </SmartLink>
              ))}
            </span>
          )}
        </div>
      )}
    </section>
  )
}
