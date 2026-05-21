import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'

export default function ArticleAround({ prev, next }) {
  const { locale } = useGlobal()
  if (!prev && !next) return <></>

  return (
    <section className='grid grid-cols-2 gap-3 my-6'>
      {prev ? (
        <SmartLink href={`/${prev.slug}`} className='gianni-card p-3 group'>
          <div className='text-[9px] uppercase tracking-wider mb-1' style={{ color: 'var(--text-muted)' }}>
            <i className='fas fa-arrow-left mr-1' /> {locale.PAGINATION.PREV}
          </div>
          <div
            className='text-[11px] font-medium leading-snug truncate group-hover:translate-x-[-2px]'
            style={{ color: 'var(--text-secondary)', transition: 'transform var(--transition-fast), color var(--transition-fast)' }}>
            {prev.title}
          </div>
        </SmartLink>
      ) : <div />}
      {next ? (
        <SmartLink href={`/${next.slug}`} className='gianni-card p-3 text-right group'>
          <div className='text-[9px] uppercase tracking-wider mb-1' style={{ color: 'var(--text-muted)' }}>
            {locale.PAGINATION.NEXT} <i className='fas fa-arrow-right ml-1' />
          </div>
          <div
            className='text-[11px] font-medium leading-snug truncate group-hover:translate-x-[2px]'
            style={{ color: 'var(--text-secondary)', transition: 'transform var(--transition-fast), color var(--transition-fast)' }}>
            {next.title}
          </div>
        </SmartLink>
      ) : <div />}
    </section>
  )
}
