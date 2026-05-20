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
import { createContext, useContext, useEffect, useRef } from 'react'
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
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), { ssr: false })
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), { ssr: false })
const Catalog = dynamic(() => import('./components/Catalog'), { ssr: false })

const ThemeGlobalGianni = createContext()
export const useGianniGlobal = () => useContext(ThemeGlobalGianni)

const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)

  return (
    <ThemeGlobalGianni.Provider value={{ searchModal }}>
      <div
        id='theme-gianni'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col scroll-smooth`}>
        <Style />
        <Header {...props} />
        <NavBar {...props} />

        <div
          id='container-wrapper'
          className='max-w-[1100px] mx-auto px-8 pt-8 flex-1'
          style={{
            display: 'grid',
            gridTemplateColumns: fullWidth ? '1fr' : '1fr 280px',
            gap: '3rem'
          }}>
          <style>{`
            @media (max-width: 900px) {
              #container-wrapper { grid-template-columns: 1fr !important; }
            }
          `}</style>

          <div id='container-inner' className='min-h-fit'>
            <Transition
              show={!onLoading}
              appear={true}
              enter='transition ease-in-out duration-700 transform order-first'
              enterFrom='opacity-0 translate-y-16'
              enterTo='opacity-100'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 -translate-y-16'
              unmount={false}>
              {slotTop}
              {children}
            </Transition>
            <AdSlot type='native' />
          </div>

          {!fullWidth && (
            <div id='right-sidebar' className='hidden max-[900px]:hidden'>
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
  return (
    <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
      {Object.keys(archivePosts).map(archiveTitle => (
        <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />
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
          <WWAds orientation='horizontal' className='w-full' />
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
    <div id='category-list' className='duration-200 flex flex-wrap'>
      {categoryOptions?.map(category => (
        <SmartLink key={category.name} href={`/category/${category.name}`} passHref legacyBehavior>
          <div className='px-5 cursor-pointer py-2 hover:opacity-80 transition-opacity' style={{ color: 'var(--text-secondary)' }}>
            <i className='mr-4 fas fa-folder' />
            {category.name}({category.count})
          </div>
        </SmartLink>
      ))}
    </div>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <div id='tags-list' className='duration-200 flex flex-wrap'>
      {tagOptions.map(tag => (
        <div key={tag.name} className='p-2'>
          <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag.name)}`} passHref className='gianni-pill'>
            <div className='font-light'>
              <i className='mr-1 fas fa-tag' />{' '}
              {tag.name + (tag.count ? `(${tag.count})` : '')}
            </div>
          </SmartLink>
        </div>
      ))}
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
