import { siteConfig } from '@/lib/config'
import Announcement from './Announcement'
import Catalog from './Catalog'

export default function SideBar(props) {
  const { notice, categories, tags } = props

  return (
    <div className='space-y-4'>
      <div className='gianni-sidebar-widget'>
        <div className='flex items-center gap-3 mb-2'>
          <img
            src={siteConfig('GIANNI_LOGO_IMG')}
            alt='avatar'
            className='w-10 h-10 rounded-full object-cover'
            style={{ border: '1px solid var(--border)' }}
          />
          <div>
            <div className='text-sm font-semibold' style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
              {siteConfig('AUTHOR')}
            </div>
            <div className='text-[10px]' style={{ color: 'var(--text-muted)' }}>
              {siteConfig('DESCRIPTION')}
            </div>
          </div>
        </div>
      </div>

      <Catalog {...props} />

      {categories && categories.length > 0 && (
        <div className='gianni-sidebar-widget'>
          <div className='text-[10px] uppercase tracking-wider mb-2 font-medium' style={{ color: 'var(--text-muted)' }}>
            Categories
          </div>
          <div className='flex flex-wrap gap-1'>
            {categories.map(c => (
              <a
                key={c.name}
                href={`/category/${c.name}`}
                className='text-[10px] px-2 py-0.5 rounded-full transition-all duration-200'
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {c.name}({c.count})
              </a>
            ))}
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className='gianni-sidebar-widget'>
          <div className='text-[10px] uppercase tracking-wider mb-2 font-medium' style={{ color: 'var(--text-muted)' }}>
            Tags
          </div>
          <div className='flex flex-wrap gap-1'>
            {tags.map(t => (
              <a
                key={t.name}
                href={`/tag/${encodeURIComponent(t.name)}`}
                className='text-[10px] px-2 py-0.5 rounded-full transition-all duration-200'
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {t.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {notice && <Announcement post={notice} />}
    </div>
  )
}
