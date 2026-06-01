import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, nextTick, type App } from 'vue'
import { useCountdown } from '../useCountdown'

let app: App | null = null

afterEach(() => {
  app?.unmount()
  app = null
})

function withSetup<T>(composable: () => T): T {
  let result!: T
  app = createApp({
    setup() {
      result = composable()
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  return result
}

describe('useCountdown - API', () => {
  describe('pad()', () => {
    it('pads single-digit numbers with a leading zero', () => {
      const { pad } = withSetup(() =>
        useCountdown({ endDateTime: [2099, 12, 31] })
      )
      expect(pad(5)).toBe('05')
    })

    it('leaves double-digit numbers unchanged', () => {
      const { pad } = withSetup(() =>
        useCountdown({ endDateTime: [2099, 12, 31] })
      )
      expect(pad(15)).toBe('15')
    })
  })

  describe('countdown values', () => {
    it('shows positive years for a far-future date', async () => {
      const { years } = withSetup(() =>
        useCountdown({ endDateTime: [2099, 12, 31, 23, 59, 59] })
      )
      await nextTick()
      expect(years.value).toBeGreaterThan(0)
    })

    it('fires the callback when end date is in the past', async () => {
      const callback = vi.fn()
      withSetup(() => useCountdown({ endDateTime: [2000, 1, 1] }, callback))
      await nextTick()
      expect(callback).toHaveBeenCalledOnce()
    })
  })

  describe('options', () => {
    it('logs a console error for an invalid timezone', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      withSetup(() =>
        useCountdown({ endDateTime: [2099, 12, 31], timezone: 'Invalid/Zone' })
      )
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('zeroIndexedMonths: true shifts month 0 to month 1', () => {
      const { endDateTime } = withSetup(() =>
        useCountdown({ endDateTime: [2099, 0, 15], zeroIndexedMonths: true })
      )
      expect(endDateTime.value.month).toBe(1)
    })

    it('zeroIndexedMonths: false keeps month 1 as month 1', () => {
      const { endDateTime } = withSetup(() =>
        useCountdown({ endDateTime: [2099, 1, 15], zeroIndexedMonths: false })
      )
      expect(endDateTime.value.month).toBe(1)
    })
  })
})
