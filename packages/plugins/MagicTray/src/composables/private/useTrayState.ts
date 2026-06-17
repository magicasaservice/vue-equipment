import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createStateStore } from '@maas/vue-equipment/utils'
import { createDefu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { TrayState, MagicTrayOptions, TraySide } from '../../types/index'

const getTrayStateStore = createStateStore<TrayState[]>('MagicTray', () => [])

function emptySides(): Record<TraySide, number> {
  return { top: 0, right: 0, bottom: 0, left: 0 }
}

function emptyDirections(): Record<TraySide, 'below' | 'above' | 'absolute'> {
  return {
    top: 'absolute',
    right: 'absolute',
    bottom: 'absolute',
    left: 'absolute',
  }
}

export function useTrayState(id: MaybeRef<string>) {
  const trayStateStore = getTrayStateStore()
  let scopeCounted = false

  // Replace arrays / records instead of merging, so per side config can be overridden
  const customDefu = createDefu((obj, key, value) => {
    if (key === 'snapPoints' || key === 'handles') {
      obj[key] = value
      return true
    }
  })

  function createState(id: string) {
    const state: TrayState = {
      id,
      refCount: 0,
      options: { ...defaultOptions },
      dragStart: undefined,
      dragging: false,
      draggingSide: undefined,
      interpolateTo: undefined,
      origin: 0,
      dragged: emptySides(),
      snapped: emptySides(),
      lastDragged: emptySides(),
      relDirection: emptyDirections(),
      activeSnapPoint: {},
      progress: emptySides(),
      overshoot: {
        outer: emptySides(),
        inner: 0,
      },
      elRect: undefined,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    trayStateStore.value = [...trayStateStore.value, state]
    return state
  }

  function deleteState() {
    const currentId = toValue(id)
    trayStateStore.value = trayStateStore.value.filter(
      (x) => x.id !== currentId
    )
  }

  function initializeState(options?: MagicTrayOptions) {
    const currentId = toValue(id)
    let state = trayStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    if (options) {
      const mappedOptions = customDefu(options, defaultOptions)
      state.options = mappedOptions
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(id)
    const state = trayStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  }, true)

  return {
    initializeState,
    trayStateStore,
  }
}
