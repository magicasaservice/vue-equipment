import {
  toRefs,
  watch,
  toValue,
  onScopeDispose,
  type MaybeRef,
  type WatchStopHandle,
} from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { usePlayerState } from './usePlayerState'

export type UsePlayerEmitterArgs = {
  id: MaybeRef<string>
}

export function usePlayerEmitter(args: UsePlayerEmitterArgs) {
  // Private state
  const { id } = args
  let scopeInitialized = false

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

  let stops: WatchStopHandle[] = []

  // Private functions
  const emitter = useMagicEmitter()

  function destroyEmitter() {
    for (const stop of stops) {
      try {
        stop()
      } catch {}
    }
    stops = []
  }

  // Public functions
  function initializeEmitter() {
    if (scopeInitialized) {
      return
    }

    scopeInitialized = true

    stops.push(
      watch(dragging, (newDragging) => {
        if (newDragging) {
          emitter.emit('onDragStart', toValue(id))
        }

        if (!newDragging) {
          emitter.emit('onDragEnd', toValue(id))
        }
      })
    )

    stops.push(
      watch(ended, (newEnded) => {
        if (newEnded) {
          emitter.emit('onEnd', toValue(id))
        }
      })
    )

    stops.push(
      watch(fullscreen, (newFullscreen) => {
        if (newFullscreen) {
          emitter.emit('onFullscreenEnter', toValue(id))
        }

        if (!newFullscreen) {
          emitter.emit('onFullscreenLeave', toValue(id))
        }
      })
    )

    stops.push(
      watch(loaded, (newLoaded) => {
        if (newLoaded) {
          emitter.emit('onLoad', toValue(id))
        }
      })
    )

    stops.push(
      watch(muted, (newMuted) => {
        if (newMuted) {
          emitter.emit('onMute', toValue(id))
        }
        if (!newMuted) {
          emitter.emit('onUnmute', toValue(id))
        }
      })
    )

    stops.push(
      watch(paused, (newPaused) => {
        if (newPaused) {
          emitter.emit('onPause', toValue(id))
        }
      })
    )

    stops.push(
      watch(playing, (newPlaying) => {
        if (newPlaying) {
          emitter.emit('onPlay', toValue(id))
        }
      })
    )

    stops.push(
      watch(rate, (newRate) => {
        if (newRate) {
          emitter.emit('onRateChange', toValue(id))
        }
      })
    )

    stops.push(
      watch(started, (newStarted) => {
        if (newStarted) {
          emitter.emit('onStart', toValue(id))
        }
      })
    )

    stops.push(
      watch(stalled, (newStalled) => {
        if (newStalled) {
          emitter.emit('onStall', toValue(id))
        }
      })
    )

    stops.push(
      watch(touched, (newTouched) => {
        if (newTouched) {
          emitter.emit('onTouch', toValue(id))
        }
      })
    )

    stops.push(
      watch(volume, (newVolume) => {
        if (newVolume) {
          emitter.emit('onVolumeChange', toValue(id))
        }
      })
    )

    stops.push(
      watch(waiting, (newWaiting) => {
        if (newWaiting) {
          emitter.emit('onWait', toValue(id))
        }
      })
    )
  }

  onScopeDispose(() => {
    destroyEmitter()
  }, true)

  return {
    initializeEmitter,
  }
}

export type UsePlayerEmitterReturn = ReturnType<typeof usePlayerEmitter>
