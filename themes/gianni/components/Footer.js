import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative w-full px-6 mt-12'>
      {/* Gradient divider line */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--divider), transparent)'
        }}
      />

      <div className='max-w-[1100px] mx-auto py-8 md:flex md:justify-between md:items-center text-xs' style={{ color: 'var(--text-muted)' }}>
        <div className='flex flex-col items-center md:items-start'>
          <div className='mb-3'>
            <SocialButton />
          </div>
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
