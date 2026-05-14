import { getAllCategories } from '@/lib/db/notion/getAllCategories'

// Tests for getAllCategories – previously 0 % covered.

describe('getAllCategories', () => {
  const categoryOptions = [
    { id: 'c1', value: 'Tech', color: 'blue' },
    { id: 'c2', value: 'Life', color: 'green' },
    { id: 'c3', value: 'Travel', color: 'red' }
  ]

  const allPages = [
    { type: 'Post', status: 'Published', category: 'Tech' },
    { type: 'Post', status: 'Published', category: 'Tech' },
    { type: 'Post', status: 'Published', category: 'Life' },
    { type: 'Post', status: 'Draft',     category: 'Travel' }, // Draft → excluded
    { type: 'Page', status: 'Published', category: 'Tech' }   // Page  → excluded
  ]

  it('counts published posts per category and respects categoryOptions order', () => {
    // regression: category list must reflect actual post counts, not option order bugs
    const result = getAllCategories({ allPages, categoryOptions })
    expect(result).toEqual([
      expect.objectContaining({ name: 'Tech', count: 2 }),
      expect.objectContaining({ name: 'Life', count: 1 })
    ])
    // Travel has no Published Posts → must not appear
    expect(result.find(c => c.name === 'Travel')).toBeUndefined()
  })

  it('includes color and id from categoryOptions', () => {
    const result = getAllCategories({ allPages, categoryOptions })
    const tech = result.find(c => c.name === 'Tech')
    expect(tech.color).toBe('blue')
    expect(tech.id).toBe('c1')
  })

  it('returns an empty array when allPages is undefined', () => {
    // regression: callers may omit allPages
    expect(
      getAllCategories({ allPages: undefined, categoryOptions })
    ).toEqual([])
  })

  it('returns an empty array when categoryOptions is undefined', () => {
    // regression: callers may omit categoryOptions
    expect(
      getAllCategories({ allPages, categoryOptions: undefined })
    ).toEqual([])
  })

  it('returns all categories when sliceCount is 0 (default)', () => {
    const result = getAllCategories({ allPages, categoryOptions, sliceCount: 0 })
    expect(result.length).toBe(2) // Tech + Life
  })

  it('respects sliceCount when positive', () => {
    // regression: sliceCount must limit the returned list
    const result = getAllCategories({ allPages, categoryOptions, sliceCount: 1 })
    expect(result.length).toBe(1)
  })

  it('returns an empty array for an empty allPages list', () => {
    expect(getAllCategories({ allPages: [], categoryOptions })).toEqual([])
  })

  it('returns an empty array when no published posts exist', () => {
    const noPubs = [
      { type: 'Post', status: 'Draft', category: 'Tech' }
    ]
    expect(getAllCategories({ allPages: noPubs, categoryOptions })).toEqual([])
  })
})
