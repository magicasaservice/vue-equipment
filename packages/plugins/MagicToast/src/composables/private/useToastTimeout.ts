import { ref, onScopeDispose } from 'vue'

interface UseToastTimeoutOptions {
  delay: number
  immediate?: boolean
}

export function useToastTimeout(
  callback: () => void,
  options: UseToastTimeoutOptions
) {
  const { delay, immediate = false } = options

  // Private state
  const timeoutId = ref<number | NodeJS.Timeout | null>(null)
  const startTime = ref<number>(0)
  const remainingTime = ref<number>(delay)

  // Private functions
  function cancel() {
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
  }

  // Public functions
  function pause() {
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value)
      remainingTime.value -= Date.now() - startTime.value
      timeoutId.value = null
    }
  }

  function play() {
    if (timeoutId.value === null) {
      startTime.value = Date.now()
      timeoutId.value = setTimeout(() => {
        callback()
        timeoutId.value = null
      }, remainingTime.value)
    }
  }

  // Start immediately
  if (immediate) {
    play()
  }

  // Cleanup
  onScopeDispose(() => cancel(), true)

  return {
    play,
    pause,
  }
}

export type UseToastTimeout = ReturnType<typeof useToastTimeout>
