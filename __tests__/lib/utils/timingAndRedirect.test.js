import fs from 'fs'
import { debounce } from '@/lib/utils/debounce'
import throttle from '@/lib/utils/throttle'
import { generateRedirectJson } from '@/lib/utils/redirect'

jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}))

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('delays function execution until wait time has passed', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced('first')
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')
  })

  it('uses the latest invocation arguments when called repeatedly', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced('a')
    jest.advanceTimersByTime(50)
    debounced('b')
    jest.advanceTimersByTime(50)
    debounced('c')
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })
})

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(0)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('delays first call and emits once with latest args in wait window', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)

    throttled('a')
    expect(fn).not.toHaveBeenCalled()

    jest.setSystemTime(10)
    throttled('b')
    jest.setSystemTime(20)
    throttled('c')

    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('c')
  })

  it('clears pending timer when an immediate execution becomes available', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)

    throttled('initial')
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('initial')

    jest.setSystemTime(110)
    throttled('queued')

    jest.setSystemTime(250)
    throttled('immediate-late')

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('immediate-late')

    jest.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('generateRedirectJson', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('writes redirect json for published posts only', () => {
    generateRedirectJson({
      allPages: [
        { id: 'a', slug: 'post-a', type: 'Post', status: 'Published' },
        { id: 'b', slug: 'post-b', type: 'Post', status: 'Draft' },
        { id: 'c', slug: 'about', type: 'Page', status: 'Published' }
      ]
    })

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './public/redirect.json',
      JSON.stringify({ a: 'post-a' })
    )
  })

  it('logs warning when write fails', () => {
    const error = new Error('disk full')
    fs.writeFileSync.mockImplementation(() => {
      throw error
    })
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    generateRedirectJson({
      allPages: [{ id: 'a', slug: 'post-a', type: 'Post', status: 'Published' }]
    })

    expect(warnSpy).toHaveBeenCalledWith('无法写入文件', error)
    warnSpy.mockRestore()
  })
})
