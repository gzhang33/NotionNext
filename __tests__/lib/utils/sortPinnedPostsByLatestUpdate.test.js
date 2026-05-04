import {
  sortPinnedPostsByLatestUpdate,
  sortPostsByTopTag,
  reorderPublishedPostsInAllPagesByTopTag
} from '@/lib/utils/pinnedPosts'

describe('sortPinnedPostsByLatestUpdate', () => {
  it('returns original array when topTag is falsy', () => {
    const posts = [
      { id: 'a', tags: ['top'], lastEditedDate: '2024-01-01' }
    ]
    const res = sortPinnedPostsByLatestUpdate(posts, '')
    expect(res).toBe(posts)
  })

  it('does not change non-pinned indices; only reorders pinned subset by lastEditedDate desc', () => {
    const posts = [
      { id: 'A', tags: ['x'], lastEditedDate: '2024-01-01' },
      { id: 'P1', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'B', tags: ['x'], lastEditedDate: '2024-02-01' },
      { id: 'P2', tags: ['top'], lastEditedDate: '2024-03-01' },
      { id: 'C', tags: ['x'], lastEditedDate: '2024-01-03' }
    ]

    const res = sortPinnedPostsByLatestUpdate(posts, 'top')
    const ids = res.map(p => p.id)

    // pinned slots are indices [1,3]; after sort, newer pinned should appear at index 1
    expect(ids).toEqual(['A', 'P2', 'B', 'P1', 'C'])
    // verify normal posts keep their original indices
    expect(res[2].id).toBe('B')
    expect(res[4].id).toBe('C')
  })

  it('keeps pinned relative order when lastEditedDate is equal (stable)', () => {
    const posts = [
      { id: 'A', tags: ['x'], lastEditedDate: '2024-01-01' },
      { id: 'P1', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'B', tags: ['x'], lastEditedDate: '2024-02-01' },
      { id: 'P2', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'C', tags: ['x'], lastEditedDate: '2024-01-03' }
    ]

    const res = sortPinnedPostsByLatestUpdate(posts, 'top')
    const ids = res.map(p => p.id)
    // stable: P1 stays before P2 in the pinned slots [1,3]
    expect(ids).toEqual(['A', 'P1', 'B', 'P2', 'C'])
  })

  it('returns original array when pinned count <= 1', () => {
    const posts = [
      { id: 'A', tags: ['x'], lastEditedDate: '2024-01-01' },
      { id: 'P1', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'B', tags: ['x'], lastEditedDate: '2024-02-01' }
    ]
    const res = sortPinnedPostsByLatestUpdate(posts, 'top')
    expect(res).toBe(posts)
  })
})

describe('sortPostsByTopTag', () => {
  it('returns same ref when topTag empty', () => {
    const posts = [{ id: 'a', tags: ['top'] }]
    expect(sortPostsByTopTag(posts, '')).toBe(posts)
  })

  it('moves tagged posts to the front; multiple pinned ordered by lastEditedDate desc', () => {
    const posts = [
      { id: 'A', tags: [], lastEditedDate: '2024-01-01' },
      { id: 'P1', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'B', tags: [], lastEditedDate: '2024-02-01' },
      { id: 'P2', tags: ['top'], lastEditedDate: '2024-03-01' }
    ]
    const res = sortPostsByTopTag(posts, 'top')
    expect(res.map(p => p.id)).toEqual(['P2', 'P1', 'A', 'B'])
  })
})

describe('reorderPublishedPostsInAllPagesByTopTag', () => {
  it('only permutes Published Post slots; leaves other rows in place', () => {
    const menu = { id: 'M', type: 'Page', status: 'Published', slug: 'm' }
    const a = { id: 'A', type: 'Post', status: 'Published', slug: 'a', tags: [] }
    const p1 = {
      id: 'P1',
      type: 'Post',
      status: 'Published',
      slug: 'p1',
      tags: ['top'],
      lastEditedDate: '2024-01-02'
    }
    const p2 = {
      id: 'P2',
      type: 'Post',
      status: 'Published',
      slug: 'p2',
      tags: ['top'],
      lastEditedDate: '2024-03-01'
    }
    const allPages = [menu, a, p1, p2]
    const res = reorderPublishedPostsInAllPagesByTopTag(allPages, 'top')
    expect(res[0]).toBe(menu)
    expect(res.map(p => p.id)).toEqual(['M', 'P2', 'P1', 'A'])
  })
})

