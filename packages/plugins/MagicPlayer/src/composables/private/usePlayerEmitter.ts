import { toRefs, watch, toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { usePlayerState } from './usePlayerState'

export type UsePlayerEmitterArgs = {
  id: MaybeRef<string>
}

export function usePlayerEmitter(args: UsePlayerEmitterArgs) {
  // Private state
  const { id } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const {
    dragging,
    ended,
    fullscreen,
    loaded,
    muted,
    paused,
    playing,
    rate,
    stalled,
    started,
    touched,
    volume,
    waiting,
  } = toRefs(state)

  // Private functions
  const emitter = useMagicEmitter()

  // Public functions
  function initializeEmitter() {
    watch(dragging, (newDragging) => {
      if (newDragging) {
        emitter.emit('onDragStart', toValue(id))
      }

      if (!newDragging) {
        emitter.emit('onDragEnd', toValue(id))
      }
    })

    watch(ended, (newEnded) => {
      if (newEnded) {
        emitter.emit('onEnd', toValue(id))
      }
    })

    watch(fullscreen, (newFullscreen) => {
      if (newFullscreen) {
        emitter.emit('onFullscreenEnter', toValue(id))
      }

      if (!newFullscreen) {
        emitter.emit('onFullscreenLeave', toValue(id))
      }
    })

    watch(loaded, (newLoaded) => {
      if (newLoaded) {
        emitter.emit('onLoad', toValue(id))
      }
    })

    watch(muted, (newMuted) => {
      if (newMuted) {
        emitter.emit('onMute', toValue(id))
      }
      if (!newMuted) {
        emitter.emit('onUnmute', toValue(id))
      }
    })

    watch(paused, (newPaused) => {
      if (newPaused) {
        emitter.emit('onPause', toValue(id))
      }
    })

    watch(playing, (newPlaying) => {
      if (newPlaying) {
        emitter.emit('onPlay', toValue(id))
      }
    })

    watch(rate, (newRate) => {
      if (newRate) {
        emitter.emit('onRateChange', toValue(id))
      }
    })

    watch(started, (newStarted) => {
      if (newStarted) {
        emitter.emit('onStart', toValue(id))
      }
    })

    watch(stalled, (newStalled) => {
      if (newStalled) {
        emitter.emit('onStall', toValue(id))
      }
    })

    watch(touched, (newTouched) => {
      if (newTouched) {
        emitter.emit('onTouch', toValue(id))
      }
    })

    watch(volume, (newVolume) => {
      if (newVolume) {
        emitter.emit('onVolumeChange', toValue(id))
      }
    })

    watch(waiting, (newWaiting) => {
      if (newWaiting) {
        emitter.emit('onWait', toValue(id))
      }
    })
  }

  return {
    initializeEmitter,
  }
}

export type UsePlayerEmitterReturn = ReturnType<typeof usePlayerEmitter>
