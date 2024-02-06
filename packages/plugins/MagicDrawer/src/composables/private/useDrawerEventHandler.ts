import { ref } from 'vue'

export function useDrawerEventHandler() {
  // Public state
  const clickEvent = ref<MouseEvent | undefined>(undefined)

  // Public functions
  function dispatchEvent(e: MouseEvent | PointerEvent) {
    const target = e.target as HTMLElement
    // @ts-ignore
    const clone = new e.constructor(e.type, e)
    clone.custom = 'magic-drawer-clone'

    target.dispatchEvent(clone)
  }

  return {
    clickEvent,
    dispatchEvent,
  }
}
