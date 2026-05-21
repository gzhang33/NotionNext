import {
  getBlogHomeHref,
  getPersonalSectionHref,
  isBlogHomePath
} from '@/themes/gianni/navigation'

describe('gianni navigation helpers', () => {
  it('builds personal section links against the configured site url', () => {
    expect(
      getPersonalSectionHref('https://giannizhang.dev/', 'projects')
    ).toBe('https://giannizhang.dev/#projects')
  })

  it('uses /blog only when the blog is rendered on the personal site origin', () => {
    expect(
      getBlogHomeHref('https://giannizhang.dev', 'https://giannizhang.dev')
    ).toBe('/blog')

    expect(
      getBlogHomeHref(
        'https://giannizhang.dev',
        'https://notion-next-seven-ebon.vercel.app'
      )
    ).toBe('/')
  })

  it('treats both standalone and proxied list routes as blog home paths', () => {
    expect(isBlogHomePath('/')).toBe(true)
    expect(isBlogHomePath('/blog')).toBe(true)
    expect(isBlogHomePath('/page/2')).toBe(true)
    expect(isBlogHomePath('/blog/page/2')).toBe(true)
    expect(isBlogHomePath('/article/demo')).toBe(false)
  })
})
