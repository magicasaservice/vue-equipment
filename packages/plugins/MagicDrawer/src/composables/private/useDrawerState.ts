import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { DrawerState, MagicDrawerOptions } from '../../types/index'
import { createDefu } from 'defu'

const getDrawerStateStore = createStateStore<DrawerState[]>(
  'MagicDrawer',
  () => []
)

export function useDrawerState(id: MaybeRef<string>) {
  const drawerStateStore = getDrawerStateStore()
  let scopeCounted = false

  const customDefu = createDefu((obj, key, value) => {
    if (key === 'close' || key === 'snapPoints') {
      obj[key] = value
      return true
    }
  })

  function createState(id: string) {
    const state: DrawerState = {
      id,
      refCount: 0,
      options: { ...defaultOptions },
      active: false,
      dragStart: undefined,
      dragging: false,
      wheeling: false,
      shouldClose: false,
      interpolateTo: undefined,
      originX: 0,
      originY: 0,
      lastDraggedX: 0,
      lastDraggedY: 0,
      draggedX: 0,
      draggedY: 0,
      relDirectionY: 'absolute',
      relDirectionX: 'absolute',
      absDirectionY: undefined,
      absDirectionX: undefined,
      elRect: undefined,
      wrapperRect: undefined,
      progress: { x: 0, y: 0 },
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    drawerStateStore.value = [...drawerStateStore.value, state]
    return state
  }

  function deleteState() {
    const currentId = toValue(id)
    drawerStateStore.value = drawerStateStore.value.filter(
      (x) => x.id !== currentId
    )
  }

  function initializeState(options?: MagicDrawerOptions) {
    const currentId = toValue(id)
    let state = drawerStateStore.value.find((entry) => entry.id === currentId)

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
    const state = drawerStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  }, true)

  return {
    initializeState,
    drawerStateStore,
  }
}
