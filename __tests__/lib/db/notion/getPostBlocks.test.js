jest.mock('@/lib/db/notion/getNotionAPI', () => ({}))
jest.mock('p-limit', () => () => fn => fn())
jest.mock('@/lib/cache/cache_manager', () => ({
  getDataFromCache: jest.fn(),
  getOrSetDataWithCache: jest.fn()
}))

import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import {
  isAppleMusicEmbedUrl,
  normalizeExternalMediaBlock
} from '@/lib/db/notion/normalizeExternalMediaBlock'

describe('formatNotionBlock', () => {
  it('detects Apple Music single-track embed URLs', () => {
    expect(
      isAppleMusicEmbedUrl(
        'https://embed.music.apple.com/us/song/neon-blue/324357768'
      )
    ).toBe(true)

    expect(
      isAppleMusicEmbedUrl(
        'https://embed.music.apple.com/us/album/girls-come-too/324357208'
      )
    ).toBe(false)
  })

  it('rewrites Apple Music song video blocks to embeds directly', () => {
    const blockValue = {
      type: 'video',
      properties: {
        source: [
          ['https://embed.music.apple.com/us/song/neon-blue/324357768']
        ]
      }
    }

    normalizeExternalMediaBlock(blockValue)

    expect(blockValue.type).toBe('embed')
  })

  it('leaves non-matching video blocks unchanged during direct normalization', () => {
    const blockValue = {
      type: 'video',
      properties: {
        source: [['https://www.youtube.com/watch?v=dQw4w9WgXcQ']]
      }
    }

    normalizeExternalMediaBlock(blockValue)

    expect(blockValue.type).toBe('video')
  })

  it('normalizes Apple Music song embeds from video blocks to embed blocks', () => {
    const formatted = formatNotionBlock({
      'apple-music-song': {
        value: {
          id: 'apple-music-song',
          type: 'video',
          properties: {
            source: [[
              'https://embed.music.apple.com/us/song/never-gonna-give-you-up/1559523357?i=1559523359'
            ]]
          }
        }
      }
    })

    expect(formatted['apple-music-song'].value.type).toBe('embed')
  })

  it('keeps regular hosted videos as video blocks', () => {
    const formatted = formatNotionBlock({
      'hosted-video': {
        value: {
          id: 'hosted-video',
          type: 'video',
          properties: {
            source: [['https://cdn.example.com/videos/demo.mp4']]
          }
        }
      }
    })

    expect(formatted['hosted-video'].value.type).toBe('video')
  })

  // ── sanitizeBlockUrls via formatNotionBlock ──────────────────────────────

  it('fixes malformed http: URLs in properties.source', () => {
    // regression: Notion sometimes exports "http:example.com" (missing //)
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'image',
          properties: { source: [['http:example.com/img.png']] }
        }
      }
    })
    expect(formatted.blk.value.properties.source[0][0]).toBe(
      'http://example.com/img.png'
    )
  })

  it('fixes malformed https: URLs in properties.source', () => {
    // regression: "https:cdn.example.com/x.png" → "https://cdn.example.com/x.png"
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'image',
          properties: { source: [['https:cdn.example.com/x.png']] }
        }
      }
    })
    expect(formatted.blk.value.properties.source[0][0]).toBe(
      'https://cdn.example.com/x.png'
    )
  })

  it('replaces completely invalid source URLs with placeholder', () => {
    // regression: garbage URL must not reach the renderer and crash
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'image',
          properties: { source: [['not a url at all']] }
        }
      }
    })
    expect(formatted.blk.value.properties.source[0][0]).toMatch(/placeholder/)
  })

  it('leaves relative (/) source URLs unchanged', () => {
    // regression: internal relative paths must not be rewritten
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'image',
          properties: { source: [['/images/photo.png']] }
        }
      }
    })
    expect(formatted.blk.value.properties.source[0][0]).toBe('/images/photo.png')
  })

  it('fixes malformed URL stored in file.url', () => {
    // regression: file blocks store the URL in file.url, not source
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'file',
          file: { url: 'https:example.com/doc.pdf' }
        }
      }
    })
    expect(formatted.blk.value.file.url).toBe('https://example.com/doc.pdf')
  })

  it('fixes malformed URL in format.page_cover', () => {
    // regression: page cover URL inside format object
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'page',
          format: { page_cover: 'https:example.com/cover.jpg' }
        }
      }
    })
    expect(formatted.blk.value.format.page_cover).toBe(
      'https://example.com/cover.jpg'
    )
  })

  // ── code block language normalization ───────────────────────────────────

  it('normalizes C++ language label in code blocks', () => {
    // regression: PrismJS uses "cpp" not "C++"
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'code',
          properties: { language: [['C++']], title: [['int x = 0;']] }
        }
      }
    })
    expect(formatted.blk.value.properties.language[0][0]).toBe('cpp')
  })

  it('normalizes C# language label in code blocks', () => {
    // regression: PrismJS uses "csharp" not "C#"
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'code',
          properties: { language: [['C#']], title: [['var x = 0;']] }
        }
      }
    })
    expect(formatted.blk.value.properties.language[0][0]).toBe('csharp')
  })

  it('normalizes Assembly language label in code blocks', () => {
    // regression: PrismJS uses "asm6502" not "Assembly"
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk',
          type: 'code',
          properties: { language: [['Assembly']], title: [['mov ax, bx']] }
        }
      }
    })
    expect(formatted.blk.value.properties.language[0][0]).toBe('asm6502')
  })

  // ── signed-URL rewriting ─────────────────────────────────────────────────

  it('rewrites attachment: source URLs to signed notion.so URLs', () => {
    // regression: Notion attachment: scheme URLs must be proxied through notion.so
    const rawUrl = 'attachment:document.pdf'
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk-id',
          type: 'file',
          properties: { source: [[rawUrl]] }
        }
      }
    })
    const result = formatted.blk.value.properties.source[0][0]
    expect(result).toContain('notion.so/signed/')
    expect(result).toContain(encodeURIComponent(rawUrl))
    expect(result).toContain('blk-id')
  })

  it('rewrites amazonaws.com source URLs to signed notion.so URLs', () => {
    // regression: S3 direct links expire; must be routed through notion.so/signed
    const rawUrl =
      'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/uuid/file.pdf'
    const formatted = formatNotionBlock({
      blk: {
        value: {
          id: 'blk-id',
          type: 'file',
          properties: { source: [[rawUrl]] }
        }
      }
    })
    const result = formatted.blk.value.properties.source[0][0]
    expect(result).toContain('notion.so/signed/')
    expect(result).toContain(encodeURIComponent(rawUrl))
  })

  // ── sync_block expansion ─────────────────────────────────────────────────

  it('expands sync_block children into sibling blocks', () => {
    // regression: sync_block children must be inlined so the renderer sees them
    const formatted = formatNotionBlock({
      sync1: {
        value: {
          id: 'sync1',
          type: 'sync_block',
          children: [
            { value: { id: 'child_a', type: 'text' } },
            { value: { id: 'child_b', type: 'text' } }
          ]
        }
      }
    })

    expect(formatted.sync1).toBeUndefined()
    expect(formatted['sync1_child_0']).toBeDefined()
    expect(formatted['sync1_child_1']).toBeDefined()
  })

  // ── role:none / permission-less blocks ──────────────────────────────────

  it('skips blocks that have a role but no value.id (permission-less blocks)', () => {
    // regression: role:none placeholder blocks must not be emitted to the renderer
    const formatted = formatNotionBlock({
      accessible: {
        value: { id: 'accessible', type: 'text' }
      },
      noperm: {
        value: { role: 'none' }
      }
    })

    expect(formatted.accessible).toBeDefined()
    // noperm should still exist in output (skipped from processing, not deleted)
    // The block is left as-is; it's the renderer's responsibility to ignore it
    expect(Object.keys(formatted)).toContain('noperm')
  })

  it('handles an empty block map without throwing', () => {
    // regression: early returns for falsy/empty input
    expect(formatNotionBlock({})).toEqual({})
    expect(formatNotionBlock(null)).toBeNull()
  })
})
