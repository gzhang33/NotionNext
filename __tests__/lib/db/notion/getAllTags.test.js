import { getAllTags } from '@/lib/db/notion/getAllTags'

// Tests for getAllTags – previously 0 % covered.
// siteConfig reads IS_TAG_COLOR_DISTINGUISHED and TAG_SORT_BY_COUNT from
// NOTION_CONFIG (the third argument), so we pass those values directly.

const NOTION_CONFIG_DEFAULTS = {
  IS_TAG_COLOR_DISTINGUISHED: false,
  TAG_SORT_BY_COUNT: true
}

const tagOptions = [
  { id: 't1', value: 'JavaScript', color: 'yellow' },
  { id: 't2', value: 'CSS',        color: 'blue' },
  { id: 't3', value: 'React',      color: 'cyan' }
]

const allPages = [
  { type: 'Post', status: 'Published',  tags: ['JavaScript', 'React'] },
  { type: 'Post', status: 'Published',  tags: ['JavaScript'] },
  { type: 'Post', status: 'Invisible',  tags: ['CSS'] },      // Invisible → counted
  { type: 'Post', status: 'Draft',      tags: ['CSS'] },      // Draft → excluded
  { type: 'Page', status: 'Published',  tags: ['JavaScript'] } // Page → excluded
]

describe('getAllTags', () => {
  it('counts published and invisible post tags, excludes drafts and pages', () => {
    // regression: Invisible posts must be included in tag counts
    const result = getAllTags({
      allPages,
      tagOptions,
      NOTION_CONFIG: NOTION_CONFIG_DEFAULTS
    })
    const js = result.find(t => t.name === 'JavaScript')
    const css = result.find(t => t.name === 'CSS')
    expect(js.count).toBe(2)
    expect(css.count).toBe(1) // only the Invisible post is counted
  })

  it('sorts by count descending when TAG_SORT_BY_COUNT is true', () => {
    // regression: JS (2) must appear before React (1)
    const result = getAllTags({
      allPages,
      tagOptions,
      NOTION_CONFIG: { ...NOTION_CONFIG_DEFAULTS, TAG_SORT_BY_COUNT: true }
    })
    expect(result[0].name).toBe('JavaScript')
  })

  it('preserves tagOptions order when TAG_SORT_BY_COUNT is false', () => {
    // regression: original insertion order kept when sorting disabled
    const result = getAllTags({
      allPages,
      tagOptions,
      NOTION_CONFIG: { ...NOTION_CONFIG_DEFAULTS, TAG_SORT_BY_COUNT: false }
    })
    const names = result.map(t => t.name)
    // JS appears before React in tagOptions
    expect(names.indexOf('JavaScript')).toBeLessThan(names.indexOf('React'))
  })

  it('de-duplicates same-name tags when IS_TAG_COLOR_DISTINGUISHED is false', () => {
    // regression: different-colored but same-named tags must merge when !distinguished
    const dupeOptions = [
      { id: 'x1', value: 'JavaScript', color: 'yellow' },
      { id: 'x2', value: 'JavaScript', color: 'red' }
    ]
    const result = getAllTags({
      allPages,
      tagOptions: dupeOptions,
      NOTION_CONFIG: { ...NOTION_CONFIG_DEFAULTS, IS_TAG_COLOR_DISTINGUISHED: false }
    })
    expect(result.filter(t => t.name === 'JavaScript').length).toBe(1)
  })

  it('keeps separate entries for same-name tags when IS_TAG_COLOR_DISTINGUISHED is true', () => {
    // regression: when colour distinction is on, duplicates must not be merged
    const dupeOptions = [
      { id: 'x1', value: 'JavaScript', color: 'yellow' },
      { id: 'x2', value: 'JavaScript', color: 'red' }
    ]
    const result = getAllTags({
      allPages,
      tagOptions: dupeOptions,
      NOTION_CONFIG: {
        ...NOTION_CONFIG_DEFAULTS,
        IS_TAG_COLOR_DISTINGUISHED: true
      }
    })
    expect(result.filter(t => t.name === 'JavaScript').length).toBe(2)
  })

  it('respects sliceCount when positive', () => {
    // regression: sliceCount must limit the returned list
    const result = getAllTags({
      allPages,
      tagOptions,
      sliceCount: 1,
      NOTION_CONFIG: NOTION_CONFIG_DEFAULTS
    })
    expect(result.length).toBe(1)
  })

  it('returns all tags when sliceCount is 0 (default)', () => {
    const result = getAllTags({
      allPages,
      tagOptions,
      sliceCount: 0,
      NOTION_CONFIG: NOTION_CONFIG_DEFAULTS
    })
    // JS, CSS, React all have at least one count
    expect(result.length).toBe(3)
  })

  it('returns an empty array when allPages is undefined', () => {
    // regression: callers may omit allPages
    expect(
      getAllTags({
        allPages: undefined,
        tagOptions,
        NOTION_CONFIG: NOTION_CONFIG_DEFAULTS
      })
    ).toEqual([])
  })

  it('returns an empty array when tagOptions is undefined', () => {
    // regression: callers may omit tagOptions
    expect(
      getAllTags({
        allPages,
        tagOptions: undefined,
        NOTION_CONFIG: NOTION_CONFIG_DEFAULTS
      })
    ).toEqual([])
  })

  it('returns an empty array when no eligible posts exist', () => {
    const noEligible = [
      { type: 'Post', status: 'Draft', tags: ['JavaScript'] }
    ]
    const result = getAllTags({
      allPages: noEligible,
      tagOptions,
      NOTION_CONFIG: NOTION_CONFIG_DEFAULTS
    })
    expect(result).toEqual([])
  })
})
