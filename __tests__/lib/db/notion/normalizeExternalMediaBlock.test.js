import {
  isAppleMusicEmbedUrl,
  normalizeExternalMediaBlock
} from '@/lib/db/notion/normalizeExternalMediaBlock'

// Extends coverage for edge-cases not covered by getPostBlocks.test.js.

describe('isAppleMusicEmbedUrl', () => {
  it('matches song paths case-insensitively', () => {
    // regression: Notion may emit mixed-case embed URLs
    expect(
      isAppleMusicEmbedUrl(
        'https://embed.music.apple.com/gb/SONG/hello/12345'
      )
    ).toBe(true)
  })

  it('returns false for playlist paths', () => {
    expect(
      isAppleMusicEmbedUrl(
        'https://embed.music.apple.com/us/playlist/my-mix/pl.12345'
      )
    ).toBe(false)
  })

  it('returns false for artist paths', () => {
    expect(
      isAppleMusicEmbedUrl(
        'https://embed.music.apple.com/us/artist/taylor-swift/159260351'
      )
    ).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect(isAppleMusicEmbedUrl('')).toBe(false)
  })

  it('returns false for non-Apple URLs', () => {
    expect(isAppleMusicEmbedUrl('https://open.spotify.com/track/abc')).toBe(false)
  })
})

describe('normalizeExternalMediaBlock edge-cases', () => {
  it('does nothing for null blockValue', () => {
    // regression: guard against null input
    expect(() => normalizeExternalMediaBlock(null)).not.toThrow()
  })

  it('does nothing for undefined blockValue', () => {
    expect(() => normalizeExternalMediaBlock(undefined)).not.toThrow()
  })

  it('does nothing when type is embed (not video)', () => {
    // regression: only video blocks should be rewritten
    const blk = {
      type: 'embed',
      properties: {
        source: [['https://embed.music.apple.com/us/song/hello/12345']]
      }
    }
    normalizeExternalMediaBlock(blk)
    expect(blk.type).toBe('embed')
  })

  it('does nothing when source is missing', () => {
    // regression: missing source must not throw
    const blk = { type: 'video', properties: {} }
    normalizeExternalMediaBlock(blk)
    expect(blk.type).toBe('video')
  })

  it('does nothing when properties is missing entirely', () => {
    const blk = { type: 'video' }
    normalizeExternalMediaBlock(blk)
    expect(blk.type).toBe('video')
  })

  it('does nothing for a non-object blockValue', () => {
    // regression: callers may pass primitives by mistake
    expect(() => normalizeExternalMediaBlock('not-an-object')).not.toThrow()
    expect(() => normalizeExternalMediaBlock(42)).not.toThrow()
  })
})
