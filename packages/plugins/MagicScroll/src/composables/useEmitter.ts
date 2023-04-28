import { Ref, ref, watch } from 'vue-demi'

export function useEmitter(
  progress: Ref<number>,
  emit: (event: 'magic-scroll:start' | 'magic-scroll:end') => void
) {
  const inProgress = ref(false)

  watch(
    () => progress.value,
    (newValue, oldValue) => {
      if (oldValue < newValue && newValue > 0) {
        if (!inProgress.value) {
          inProgress.value = true
          emit('magic-scroll:start')
        }

        if (newValue === 1) {
          inProgress.value = false
          emit('magic-scroll:end')
        }
      }

      if (oldValue > newValue && newValue < 1) {
        if (!inProgress.value) {
          inProgress.value = true
          emit('magic-scroll:start')
        }

        if (newValue === 0) {
          inProgress.value = false
          emit('magic-scroll:end')
        }
      }
    }
  )
}
