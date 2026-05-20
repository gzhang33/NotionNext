import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import NotionIcon from '@/components/NotionIcon'
import LazyImage from '@/components/LazyImage'
import CONFIG from '../config'

function estimateReadingTime(wordCount) {
  if (!wordCount || wordCount <= 0) return null
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} min read`
}

export default function ArticleInfo(props) {
  const { post } = props
  const showCover = siteConfig('GIANNI_POST_COVER_ENABLE', null, CONFIG) && post?.pageCoverThumbnail
  const readingTime = estimateReadingTime(post?.wordCount)

  return (
    <section className='mb-6'>
      {showCover && (
        <div className='mb-4 overflow-hidden' style={{ borderRadius: 'var(--cover-radius)' }}>
          <LazyImage
            src={post.pageCoverThumbnail}
            alt={post.title}
            className='w-full max-h-[300px] object-cover'
          />
        </div>
      )}

      <h1
        className='blog-item-title text-2xl md:text-3xl font-bold leading-tight mb-4 no-underline'
        style={{
          fontFamily: "'Syne', sans-serif",
          color: 'var(--text)',
          borderLeft: '3px solid var(--accent)',
          paddingLeft: '16px'
        }}>
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
        {post?.title}
      </h1>

      {post?.type !== 'Page' && (
        <div
          className='flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] py-2 px-3'
          style={{
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)'
          }}>
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
          {readingTime && (
            <span>
              <i className='fa-regular fa-file-lines mr-1' />
              {readingTime}
            </span>
          )}
          {post?.category && (
            <span>
              <i className='fa-regular fa-folder mr-1' />
              <SmartLink href={`/category/${post?.category}`} style={{ color: 'var(--text-secondary)' }}>
                {post?.category}
              </SmartLink>
            </span>
          )}
          {post?.tags?.length > 0 && (
            <span className='flex items-center gap-1.5'>
              {post.tags.map(t => (
                <SmartLink key={t} href={`/tag/${encodeURIComponent(t)}`}>
                  <span className='gianni-tag'>{t}</span>
                </SmartLink>
              ))}
            </span>
          )}
        </div>
      )}
    </section>
  )
}
