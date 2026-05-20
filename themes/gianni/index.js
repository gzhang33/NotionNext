import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), { ssr: false })
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), { ssr: false })
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false })
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), { ssr: false })
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const Header = dynamic(() => import('./components/Header'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const SideBar = dynamic(() => import('./components/SideBar'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), { ssr: false })
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const SearchInput = dynamic(() => import('./components/SearchInput'), { ssr: false })
const WWads = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), { ssr: false })
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), { ssr: false })
const Catalog = dynamic(() => import('./components/Catalog'), { ssr: false })
const ReadingProgress = dynamic(() => import('./components/ReadingProgress'), { ssr: false })
const MobileNav = dynamic(() => import('./components/MobileNav'), { ssr: false })
const ThemeToggle = dynamic(() => import('./components/ThemeToggle'), { ssr: false })

const ThemeGlobalGianni = createContext()
export const useGianniGlobal = () => useContext(ThemeGlobalGianni)

const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <ThemeGlobalGianni.Provider value={{ searchModal, mobileNavOpen, setMobileNavOpen }}>
      <div
        id='theme-gianni'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col scroll-smooth`}>
        <Style />
        <ReadingProgress />
        <Header {...props} />
        <ThemeToggle />
        <NavBar {...props} />
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div
          id='container-wrapper'
          className='max-w-[1100px] mx-auto px-8 pt-8 flex-1'
          style={{
            display: 'grid',
            gridTemplateColumns: fullWidth ? '1fr' : '1fr 280px',
            gap: '3rem'
          }}>

          <div id='container-inner' className='min-h-fit'>
            <Transition
              show={!onLoading}
              appear={true}
              enter='transition ease-out duration-500 transform order-first'
              enterFrom='opacity-0 translate-y-8'
              enterTo='opacity-100'
              leave='transition ease-in duration-300 transform'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 -translate-y-8'
              unmount={false}>
              {slotTop}
              {children}
            </Transition>
            <AdSlot type='native' />
          </div>

          {!fullWidth && (
            <div id='right-sidebar'>
              <SideBar {...props} />
            </div>
          )}
        </div>

        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
        <Footer {...props} />
      </div>
    </ThemeGlobalGianni.Provider>
  )
}

const LayoutIndex = props => <LayoutPostList {...props} />

const LayoutPostList = props => (
  <>
    <BlogPostBar {...props} />
    {siteConfig('POST_LIST_STYLE') === 'page' ? (
      <BlogListPage {...props} />
    ) : (
      <BlogListScroll {...props} />
    )}
  </>
)

const LayoutSearch = props => {
  const { keyword } = props
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: { element: 'span', className: 'text-red-500 border-b border-dashed' }
      })
    }
  }, [])
  const slotTop = siteConfig('ALGOLIA_APP_ID') ? null : <SearchInput {...props} />
  return <LayoutPostList {...props} slotTop={slotTop} />
}

const LayoutArchive = props => {
  const { archivePosts } = props
  const animate = siteConfig('GIANNI_ANIMATE_LISTS', null, CONFIG)

  return (
    <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
      {Object.keys(archivePosts).map((archiveTitle, i) => (
        <BlogArchiveItem
          key={archiveTitle}
          archiveTitle={archiveTitle}
          archivePosts={archivePosts}
          index={i}
          animate={animate}
        />
      ))}
    </div>
  )
}

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}
      {!lock && post && (
        <div className='max-w-none'>
          <ArticleInfo post={post} />
          <WWads orientation='horizontal' className='w-full' />
          <div id='article-wrapper'>
            {!lock && <NotionPage post={post} />}
          </div>
          <ShareBar post={post} />
          <AdSlot type={'in-article'} />
          {post?.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}
          <Comment frontMatter={post} />
        </div>
      )}
      {!lock && post && !fullWidth && (
        <div className='hidden max-[900px]:hidden sticky top-8 self-start'>
          <Catalog {...props} />
        </div>
      )}
    </>
  )
}

const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector('#article-wrapper #notion-article')
          if (!article) router.push('/404')
        }
      }, waiting404)
    }
  }, [post])
  return <>404 Not found.</>
}

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <div className='mb-6 pb-4' style={{ borderBottom: '1px solid var(--divider)' }}>
      <div className='gianni-section-title'>
        <i className='fas fa-folder mr-1' />
        Categories
      </div>
      <div className='flex flex-wrap gap-2 mt-2'>
        {categoryOptions?.map(category => (
          <SmartLink key={category.name} href={`/category/${encodeURIComponent(category.name)}`}>
            <span className='gianni-tag' style={{ fontSize: '10px', padding: '4px 12px' }}>
              {category.name}({category.count})
            </span>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <div className='mb-6 pb-4' style={{ borderBottom: '1px solid var(--divider)' }}>
      <div className='gianni-section-title'>
        <i className='fas fa-tag mr-1' />
        Tags
      </div>
      <div className='flex flex-wrap gap-2 mt-2'>
        {tagOptions.map(tag => (
          <SmartLink key={tag.name} href={`/tag/${encodeURIComponent(tag.name)}`}>
            <span className='gianni-tag' style={{ fontSize: '10px', padding: '4px 12px' }}>
              {tag.name}{tag.count ? `(${tag.count})` : ''}
            </span>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
