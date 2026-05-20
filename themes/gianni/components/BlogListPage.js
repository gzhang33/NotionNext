import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import { useEffect, useRef } from 'react'
import { BlogItem } from './BlogItem'

export default function BlogListPage(props) {
  const { page = 1, posts, postCount } = props
  const router = useRouter()
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const currentPage = +page
  const animate = siteConfig('GIANNI_ANIMATE_LISTS', null, CONFIG)
  const containerRef = useRef(null)

  const SIMPLE_POST_AD_ENABLE = siteConfig('SIMPLE_POST_AD_ENABLE', false, CONFIG)
  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  useEffect(() => {
    if (!animate || !containerRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running'
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -40px 0px' }
    )
    const items = containerRef.current.querySelectorAll('.gianni-animate-in')
    items.forEach(item => {
      item.style.animationPlayState = 'paused'
      observer.observe(item)
    })
    return () => observer.disconnect()
  }, [posts, animate])

  return (
    <div className='w-full mb-12'>
      <div id='posts-wrapper' ref={containerRef}>
        {posts?.map((p, index) => (
          <div key={p.id}>
            {SIMPLE_POST_AD_ENABLE && (index + 1) % 3 === 0 && <AdSlot type='in-article' />}
            {SIMPLE_POST_AD_ENABLE && index + 1 === 4 && <AdSlot type='flow' />}
            <BlogItem post={p} index={index} animate={animate} />
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-4 pt-4' style={{ borderTop: '1px solid var(--divider)' }}>
        <SmartLink
          href={{
            pathname: currentPage - 1 === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`gianni-pill ${showPrev ? '' : 'invisible pointer-events-none'}`}>
          <i className='fa-solid fa-arrow-left mr-1' /> Newer
        </SmartLink>

        <span className='text-[10px]' style={{ color: 'var(--text-muted)' }}>
          {currentPage} / {totalPage}
        </span>

        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`gianni-pill ${showNext ? '' : 'invisible pointer-events-none'}`}>
          Older <i className='fa-solid fa-arrow-right ml-1' />
        </SmartLink>
      </div>
    </div>
  )
}
