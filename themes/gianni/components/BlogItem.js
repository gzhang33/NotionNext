import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

export const BlogItem = props => {
  const { post } = props
  const dateStr = post.publishDay || post.date?.start_date
  const formattedDate = formatShortDate(dateStr)

  return (
    <div className="gianni-timeline-item flex gap-3.5 pb-6 cursor-pointer relative">
      <div className="flex-shrink-0 flex flex-col items-center w-5 relative">
        <div className="gianni-timeline-dot mt-1.5"></div>
        <div className="gianni-timeline-line"></div>
      </div>

      <div className="flex-1 min-w-0">
        {formattedDate && (
          <div className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {formattedDate}
          </div>
        )}

        <SmartLink href={post.href}>
          <div className="gianni-timeline-title text-sm font-semibold leading-tight" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {post.title}
          </div>
        </SmartLink>

        {post.summary && (
          <div className="text-[11px] mt-1 font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {post.summary}...
          </div>
        )}

        {post?.tags?.length > 0 && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {post.tags.map(t => (
              <span key={t} className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
