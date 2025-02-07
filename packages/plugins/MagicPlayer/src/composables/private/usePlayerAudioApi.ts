import { ref, watch, toValue, type MaybeRef } from 'vue'
import { usePlayerStateEmitter } from './usePlayerStateEmitter'
import { usePlayerMediaApi } from './usePlayerMediaApi'

export type UsePlayerAudioApiArgs = {
  id: MaybeRef<string>
}

export function usePlayerAudioApi(args: UsePlayerAudioApiArgs) {
  // Private state
  const { id } = args
  const { playing, currentTime, muted } = usePlayerMediaApi({ id })

  // Public state
  const touched = ref(false)
  const mouseEntered = ref(false)

  // Public functions
  function play() {
    playing.value = true
  }

  function pause() {
    playing.value = false
  }

  function togglePlay() {
    playing.value = !playing.value
  }

  function seek(time: number) {
    currentTime.value = time
  }

  function mute() {
    muted.value = true
  }

  function unmute() {
    muted.value = false
  }

  function onMouseenter() {
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
  }

  // Lifecycle hooks and listeners
  watch(playing, (value) => {
    if (!touched.value && value) {
      touched.value = true
    }
  })

  const emitter = usePlayerStateEmitter()

  // Listen to updates
  emitter.on('update', (payload) => {
    if (payload.id !== toValue(id)) return

    if (payload.api === 'player') {
      switch (payload.key) {
        case 'mouseEntered':
          mouseEntered.value = payload.value as boolean
          break
        case 'touched':
          touched.value = payload.value as boolean
          break
      }
    }
  })

  // Emit updates
  watch(mouseEntered, (value) => {
    emitter.emit('update', {
      id: toValue(id),
      api: 'player',
      key: 'mouseEntered',
      value,
    })
  })

  watch(touched, (value) => {
    emitter.emit('update', {
      id: toValue(id),
      api: 'player',
      key: 'touched',
      value,
    })
  })

  return {
    mouseEntered,
    touched,
    play,
    pause,
    togglePlay,
    seek,
    mute,
    unmute,
    onMouseenter,
    onMouseleave,
  }
}

export type UsePlayerAudioApiReturn = ReturnType<typeof usePlayerAudioApi>
