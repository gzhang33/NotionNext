import { isArticleDetailNavigationPath } from '@/lib/utils/articleRouteDetection'

describe('isArticleDetailNavigationPath', () => {
  it('matches two-segment article paths', () => {
    expect(isArticleDetailNavigationPath('/article/hello-world')).toBe(true)
    expect(isArticleDetailNavigationPath('/posts/my-post')).toBe(true)
  })

  it('matches locale-prefixed paths', () => {
    expect(isArticleDetailNavigationPath('/zh-CN/article/hello')).toBe(true)
    expect(isArticleDetailNavigationPath('/en/posts/hello')).toBe(true)
  })

  it('excludes known listing / utility routes', () => {
    expect(isArticleDetailNavigationPath('/archive')).toBe(false)
    expect(isArticleDetailNavigationPath('/category/tech')).toBe(false)
    expect(isArticleDetailNavigationPath('/tag/dev')).toBe(false)
    expect(isArticleDetailNavigationPath('/search/keyword')).toBe(false)
    expect(isArticleDetailNavigationPath('/page/2')).toBe(false)
    expect(isArticleDetailNavigationPath('/dashboard')).toBe(false)
  })

  it('returns false for root and single segment', () => {
    expect(isArticleDetailNavigationPath('/')).toBe(false)
    expect(isArticleDetailNavigationPath('/about')).toBe(false)
  })
})
