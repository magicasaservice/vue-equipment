import { describe, it, expect } from 'vitest'
import { lockSelection } from './selectionLock'

function selectstart() {
  const event = new Event('selectstart', { bubbles: true, cancelable: true })
  document.body.dispatchEvent(event)
  return event
}

describe('lockSelection', () => {
  it('disables selection on the root while locked', () => {
    const release = lockSelection()
    expect(document.documentElement.style.userSelect).toBe('none')
    expect(selectstart().defaultPrevented).toBe(true)

    release()
    expect(document.documentElement.style.userSelect).toBe('')
    expect(selectstart().defaultPrevented).toBe(false)
  })

  it('restores a previous inline value', () => {
    document.documentElement.style.userSelect = 'text'

    const release = lockSelection()
    expect(document.documentElement.style.userSelect).toBe('none')

    release()
    expect(document.documentElement.style.userSelect).toBe('text')
    document.documentElement.style.userSelect = ''
  })

  it('keeps the lock until every holder releases', () => {
    const releaseFirst = lockSelection()
    const releaseSecond = lockSelection()

    releaseFirst()
    expect(document.documentElement.style.userSelect).toBe('none')

    releaseSecond()
    expect(document.documentElement.style.userSelect).toBe('')
  })

  it('ignores a repeated release', () => {
    const releaseFirst = lockSelection()
    const releaseSecond = lockSelection()

    releaseFirst()
    releaseFirst()
    expect(document.documentElement.style.userSelect).toBe('none')

    releaseSecond()
    expect(document.documentElement.style.userSelect).toBe('')
  })
})
