import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import Announcement from './Announcement'
import Catalog from './Catalog'

export default function SideBar(props) {
  const { notice, categories, tags } = props

  return (
    <div className='space-y-4' style={{ position: 'sticky', top: 'calc(var(--header-height) + 1rem)', alignSelf: 'start' }}>
      <div className='gianni-sidebar-widget'>
        <div className='flex items-center gap-3 mb-2'>
          <img
            src={siteConfig('GIANNI_AVATAR_IMG')}
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
          <div className='gianni-section-title'>
            <i className='fas fa-folder mr-1' />
            Categories
          </div>
          <div className='flex flex-wrap gap-1'>
            {categories.map(c => (
              <SmartLink
                key={c.name}
                href={`/category/${encodeURIComponent(c.name)}`}
                className='gianni-tag'
                style={{ fontSize: '10px', padding: '3px 10px' }}>
                {c.name}({c.count})
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className='gianni-sidebar-widget'>
          <div className='gianni-section-title'>
            <i className='fas fa-tag mr-1' />
            Tags
          </div>
          <div className='flex flex-wrap gap-1'>
            {tags.map(t => (
              <SmartLink
                key={t.name}
                href={`/tag/${encodeURIComponent(t.name)}`}
                className='gianni-tag'>
                {t.name}
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      {notice && <Announcement post={notice} />}
    </div>
  )
}
