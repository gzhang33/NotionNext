import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'
import CONFIG from '../config'
import { BlogItem } from './BlogItem'

export default function BlogListScroll(props) {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const animate = siteConfig('GIANNI_ANIMATE_LISTS', null, CONFIG)
  const containerRef = useRef(null)

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
    <div id='posts-wrapper' ref={containerRef} className='w-full mb-12'>
      {posts?.slice(0, POSTS_PER_PAGE).map((p, i) => (
        <BlogItem key={p.id} post={p} index={i} animate={animate} />
      ))}
    </div>
  )
}
