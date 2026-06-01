import { describe, it, expect, vi } from 'vitest'
import { useMagicError } from '../src/composables/useMagicError'
import { MagicError } from '../src/class/MagicError'

describe('MagicError', () => {
  describe('MagicError class', () => {
    it('extends Error', () => {
      const err = new MagicError('test', 'CODE', 'source')
      expect(err).toBeInstanceOf(Error)
      expect(err).toBeInstanceOf(MagicError)
    })

    it('sets name to MagicError', () => {
      const err = new MagicError('test', 'CODE', 'source')
      expect(err.name).toBe('MagicError')
    })

    it('stores errorCode', () => {
      const err = new MagicError('test', 'MY_CODE', 'source')
      expect(err.errorCode).toBe('MY_CODE')
    })

    it('stores numeric errorCode', () => {
      const err = new MagicError('test', 42, 'source')
      expect(err.errorCode).toBe(42)
    })

    it('stores source', () => {
      const err = new MagicError('test', 'CODE', 'MyComponent')
      expect(err.source).toBe('MyComponent')
    })

    it('stores timestamp', () => {
      const before = Date.now()
      const err = new MagicError('test', 'CODE', 'source')
      const after = Date.now()
      expect(err.timestamp).toBeGreaterThanOrEqual(before)
      expect(err.timestamp).toBeLessThanOrEqual(after)
    })

    it('stores message', () => {
      const err = new MagicError('something went wrong', 'CODE', 'source')
      expect(err.message).toBe('something went wrong')
    })

    it('accepts cause option', () => {
      const cause = new Error('original')
      const err = new MagicError('wrapped', 'CODE', 'source', { cause })
      expect(err.cause).toBe(cause)
    })

    it('captures stack trace', () => {
      const err = new MagicError('test', 'CODE', 'source')
      expect(typeof err.stack).toBe('string')
      expect(err.stack).toContain('MagicError')
    })
  })

  describe('useMagicError', () => {
    describe('return shape', () => {
      it('returns expected functions', () => {
        const api = useMagicError()
        expect(typeof api.assert).toBe('function')
        expect(typeof api.throwError).toBe('function')
        expect(typeof api.logError).toBe('function')
        expect(typeof api.logWarning).toBe('function')
        expect(api.MagicError).toBe(MagicError)
      })
    })

    describe('throwError', () => {
      it('throws MagicError', () => {
        const api = useMagicError({ prefix: 'Test' })
        expect(() =>
          api.throwError({ message: 'fail', errorCode: 'ERR' })
        ).toThrow(MagicError)
      })

      it('includes prefix in message', () => {
        const api = useMagicError({ prefix: 'MyPlugin' })
        try {
          api.throwError({ message: 'broke', errorCode: 'ERR' })
        } catch (e: any) {
          expect(e.message).toContain('[MyPlugin]')
          expect(e.message).toContain('broke')
        }
      })

      it('sets errorCode on thrown error', () => {
        const api = useMagicError()
        try {
          api.throwError({ message: 'fail', errorCode: 'SPECIFIC_CODE' })
        } catch (e: any) {
          expect(e.errorCode).toBe('SPECIFIC_CODE')
        }
      })

      it('sets source from args', () => {
        const api = useMagicError({ source: 'MySource' })
        try {
          api.throwError({ message: 'fail', errorCode: 'ERR' })
        } catch (e: any) {
          expect(e.source).toBe('MySource')
        }
      })

      it('passes cause through', () => {
        const api = useMagicError()
        const cause = new Error('root')
        try {
          api.throwError({ message: 'fail', errorCode: 'ERR', cause })
        } catch (e: any) {
          expect(e.cause).toBe(cause)
        }
      })
    })

    describe('assert', () => {
      it('does not throw for truthy value', () => {
        const api = useMagicError()
        expect(() =>
          api.assert('hello', { message: 'fail', errorCode: 'ERR' })
        ).not.toThrow()
      })

      it('does not throw for 0', () => {
        const api = useMagicError()
        expect(() =>
          api.assert(0, { message: 'fail', errorCode: 'ERR' })
        ).not.toThrow()
      })

      it('does not throw for empty string', () => {
        const api = useMagicError()
        expect(() =>
          api.assert('', { message: 'fail', errorCode: 'ERR' })
        ).not.toThrow()
      })

      it('throws for null', () => {
        const api = useMagicError()
        expect(() =>
          api.assert(null, { message: 'is null', errorCode: 'NULL' })
        ).toThrow(MagicError)
      })

      it('throws for undefined', () => {
        const api = useMagicError()
        expect(() =>
          api.assert(undefined, { message: 'is undefined', errorCode: 'UNDEF' })
        ).toThrow(MagicError)
      })

      it('does not throw for false', () => {
        const api = useMagicError()
        expect(() =>
          api.assert(false, { message: 'fail', errorCode: 'ERR' })
        ).not.toThrow()
      })
    })

    describe('logError', () => {
      it('calls console.error with prefix', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const api = useMagicError({ prefix: 'TestLog' })
        api.logError('something bad')
        expect(spy).toHaveBeenCalledWith('[TestLog]:', 'something bad')
        spy.mockRestore()
      })
    })

    describe('logWarning', () => {
      it('calls console.warn with prefix', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const api = useMagicError({ prefix: 'TestWarn' })
        api.logWarning('careful')
        expect(spy).toHaveBeenCalledWith('[TestWarn]:', 'careful')
        spy.mockRestore()
      })
    })

    describe('defaults', () => {
      it('defaults prefix to MagicError', () => {
        const api = useMagicError()
        try {
          api.throwError({ message: 'test', errorCode: 'ERR' })
        } catch (e: any) {
          expect(e.message).toContain('[MagicError]')
        }
      })

      it('defaults source to vue-equipment', () => {
        const api = useMagicError()
        try {
          api.throwError({ message: 'test', errorCode: 'ERR' })
        } catch (e: any) {
          expect(e.source).toBe('vue-equipment')
        }
      })
    })
  })
})
