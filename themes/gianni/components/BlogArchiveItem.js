import SmartLink from '@/components/SmartLink'

export default function BlogArchiveItem({ archiveTitle, archivePosts, index = 0, animate = false }) {
  const animStyle = animate ? { animationDelay: `${index * 80}ms` } : {}
  const getPostHref = post => post?.href || (post?.slug ? `/${post.slug}` : '#')

  return (
    <div className={animate ? 'gianni-animate-in' : ''} style={animStyle}>
      <div
        id={archiveTitle}
        className='pt-10 pb-3 text-xl font-bold'
        style={{
          fontFamily: "'Syne', sans-serif",
          color: 'var(--text)',
          borderLeft: '3px solid var(--accent)',
          paddingLeft: '12px'
        }}>
        {archiveTitle}
      </div>

      <ul className='space-y-0'>
        {archivePosts[archiveTitle].map((post, i) => (
          <li
            key={post.id}
            className='gianni-timeline-item flex gap-3.5 pb-4 relative cursor-pointer'
            style={animate ? { animationDelay: `${(index * 80) + (i * 40)}ms` } : {}}>

            <div className='flex-shrink-0 flex flex-col items-center w-5 relative'>
              <div className='gianni-timeline-dot mt-1' />
              <div className='gianni-timeline-line' />
            </div>

            <div className='flex-1 min-w-0'>
              {post.date?.start_date && (
                <div className='text-[10px] font-mono tracking-wider' style={{ color: 'var(--text-muted)' }}>
                  {post.date.start_date}
                </div>
              )}
              <SmartLink href={getPostHref(post)}>
                <div className='text-sm font-medium leading-tight' style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}>
                  {post.title}
                </div>
              </SmartLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
