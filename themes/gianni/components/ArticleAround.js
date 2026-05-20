import SmartLink from '@/components/SmartLink'

export default function ArticleAround({ prev, next }) {
  if (!prev && !next) return <></>

  return (
    <section
      className='flex items-center justify-between my-6 py-4'
      style={{ borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)' }}>
      {prev ? (
        <SmartLink
          href={`/${prev.slug}`}
          className='text-[11px] cursor-pointer flex items-center gap-1 transition-colors duration-200 max-w-[45%] truncate'>
          <i className='fas fa-angle-double-left' style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{prev.title}</span>
        </SmartLink>
      ) : <div />}
      {next ? (
        <SmartLink
          href={`/${next.slug}`}
          className='text-[11px] cursor-pointer flex items-center gap-1 transition-colors duration-200 max-w-[45%] truncate justify-end'>
          <span style={{ color: 'var(--text-secondary)' }}>{next.title}</span>
          <i className='fas fa-angle-double-right' style={{ color: 'var(--text-muted)' }} />
        </SmartLink>
      ) : <div />}
    </section>
  )
}
