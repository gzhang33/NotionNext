const {
  normalizeNotionMetadata,
  normalizeCollection,
  normalizeSchema,
  normalizePageBlock
} = require('@/lib/db/notion/normalizeUtil')

// Tests for normalizeUtil.js – previously 0 % covered.
// Each suite targets one exported function and its known branches.

describe('normalizeNotionMetadata', () => {
  it('returns null when block is null', () => {
    // regression: safe when called with missing blockMap entry
    expect(normalizeNotionMetadata(null, 'page_1')).toBeNull()
  })

  it('returns null when the pageId key is absent from the block', () => {
    expect(normalizeNotionMetadata({}, 'missing')).toBeNull()
  })

  it('returns null when rawValue is falsy', () => {
    expect(normalizeNotionMetadata({ page_1: { value: null } }, 'page_1')).toBeNull()
  })

  it('returns rawValue directly when it already has a type', () => {
    // regression: old-format blocks have { value: { id, type } }
    const rawValue = { id: 'page_1', type: 'page' }
    const result = normalizeNotionMetadata({ page_1: { value: rawValue } }, 'page_1')
    expect(result).toBe(rawValue)
  })

  it('unwraps one level when rawValue lacks type but has nested value', () => {
    // regression: new-format blocks have { value: { value: { id, type } } }
    const inner = { id: 'page_1', type: 'page' }
    const block = { page_1: { value: { value: inner } } }
    expect(normalizeNotionMetadata(block, 'page_1')).toBe(inner)
  })

  it('returns null when rawValue has no type and no nested value', () => {
    const block = { page_1: { value: { something: 'else' } } }
    expect(normalizeNotionMetadata(block, 'page_1')).toBeNull()
  })
})

describe('normalizeCollection', () => {
  it('returns the collection as-is when it already has a schema', () => {
    // regression: do not over-unwrap already-correct collections
    const col = { schema: { title: { name: 'Name', type: 'title' } } }
    expect(normalizeCollection(col)).toBe(col)
  })

  it('unwraps one value level to reach the schema', () => {
    // regression: { value: { schema: ... }, role: 'editor' }
    const inner = { schema: { title: { name: 'Name', type: 'title' } } }
    expect(normalizeCollection({ value: inner })).toBe(inner)
  })

  it('unwraps two value levels to reach the schema', () => {
    // regression: doubly-nested Notion payloads
    const inner = { schema: { title: { name: 'Name', type: 'title' } } }
    expect(normalizeCollection({ value: { value: inner } })).toBe(inner)
  })

  it('returns the last reachable object when schema is never found', () => {
    // regression: graceful fallback when schema is absent
    const result = normalizeCollection({ something: 'other' })
    expect(result).toEqual({ something: 'other' })
  })

  it('returns empty object for null/undefined input', () => {
    expect(normalizeCollection(null)).toEqual({})
    expect(normalizeCollection(undefined)).toEqual({})
  })
})

describe('normalizeSchema', () => {
  it('returns an empty object for an empty schema', () => {
    expect(normalizeSchema({})).toEqual({})
  })

  it('normalizes each field to include name and type strings', () => {
    const raw = {
      abc: { name: 'Title', type: 'title' },
      def: { name: 'Tag', type: 'multi_select' }
    }
    const result = normalizeSchema(raw)
    expect(result.abc).toMatchObject({ name: 'Title', type: 'title' })
    expect(result.def).toMatchObject({ name: 'Tag', type: 'multi_select' })
  })

  it('defaults missing name and type to empty strings', () => {
    // regression: Notion can return schema entries with no name/type
    const result = normalizeSchema({ xyz: {} })
    expect(result.xyz.name).toBe('')
    expect(result.xyz.type).toBe('')
  })

  it('preserves extra fields beyond name and type', () => {
    const result = normalizeSchema({ xyz: { name: 'X', type: 'text', extra: true } })
    expect(result.xyz.extra).toBe(true)
  })
})

describe('normalizePageBlock', () => {
  it('returns null for null/undefined input', () => {
    expect(normalizePageBlock(null)).toBeNull()
    expect(normalizePageBlock(undefined)).toBeNull()
  })

  it('returns the block when it already has a type', () => {
    // regression: old-format blocks with { id, type }
    const blk = { id: 'page_1', type: 'page' }
    expect(normalizePageBlock(blk)).toBe(blk)
  })

  it('returns the block when it has properties but no type', () => {
    const blk = { properties: { title: [['Hello']] } }
    expect(normalizePageBlock(blk)).toBe(blk)
  })

  it('returns collection_view_page blocks immediately', () => {
    // regression: collection pages must not be further unwrapped
    const blk = {
      type: 'collection_view_page',
      collection_id: 'col_1'
    }
    expect(normalizePageBlock(blk)).toBe(blk)
  })

  it('unwraps one value level to reach the block data', () => {
    // regression: new-format payload { value: { id, type } }
    const inner = { id: 'page_1', type: 'page' }
    expect(normalizePageBlock({ value: inner })).toBe(inner)
  })

  it('returns null when wrapped object has no value and no type', () => {
    expect(normalizePageBlock({ something: 'else' })).toBeNull()
  })
})
