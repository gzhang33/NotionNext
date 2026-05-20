import { useGlobal } from '@/lib/global'

export default function BlogPostBar(props) {
  const { tag, category } = props
  const { locale } = useGlobal()

  if (tag) {
    return (
      <div className='mb-6 pb-4' style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className='gianni-section-title'>
          <i className='fas fa-tag mr-1' />
          {locale.COMMON.TAGS}
        </div>
        <div className='text-lg font-bold' style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
          {tag}
        </div>
      </div>
    )
  } else if (category) {
    return (
      <div className='mb-6 pb-4' style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className='gianni-section-title'>
          <i className='fas fa-folder mr-1' />
          {locale.COMMON.CATEGORY}
        </div>
        <div className='text-lg font-bold' style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
          {category}
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
