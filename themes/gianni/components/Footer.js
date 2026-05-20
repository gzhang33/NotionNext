import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'

export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative w-full px-6 mt-12' style={{ borderTop: '1px solid var(--divider)' }}>
      <div className='max-w-[1100px] mx-auto py-8 md:flex md:justify-between items-center text-xs' style={{ color: 'var(--text-muted)' }}>
        <div className='text-center'>
          &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights reserved.
        </div>
        <div className='md:p-0 text-center md:text-right mt-3 md:mt-0'>
          {siteConfig('BEI_AN') && (
            <a href={siteConfig('BEI_AN_LINK')} className='no-underline hover:underline ml-4'>
              {siteConfig('BEI_AN')}
            </a>
          )}
          <BeiAnGongAn />
          <span className='no-underline ml-4'>
            Powered by{' '}
            <a href='https://github.com/tangly1024/NotionNext' className='hover:underline'>
              NotionNext {siteConfig('VERSION')}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
