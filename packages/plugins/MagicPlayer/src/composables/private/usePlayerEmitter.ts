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
    buffered,
    currentTime,
    dragging,
    duration,
    ended,
    fullscreen,
    loaded,
    muted,
    paused,
    playing,
    rate,
    seeking,
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
    watch(buffered, (newBuffered, oldBuffered) => {
      if (newBuffered.join() !== oldBuffered?.join()) {
        emitter.emit('buffered', {
          id: toValue(id),
          value: newBuffered,
        })
      }
    })

    watch(currentTime, (newCurrentTime, oldCurrentTime) => {
      if (newCurrentTime !== oldCurrentTime) {
        emitter.emit('currentTime', {
          id: toValue(id),
          value: newCurrentTime,
        })
      }
    })

    watch(dragging, (newDragging, oldDragging) => {
      if (newDragging !== oldDragging) {
        emitter.emit('dragging', { id: toValue(id), value: newDragging })
      }
    })

    watch(duration, (newDuration, oldDuration) => {
      if (newDuration !== oldDuration) {
        emitter.emit('duration', { id: toValue(id), value: newDuration })
      }
    })

    watch(ended, (newEnded, oldEnded) => {
      if (newEnded !== oldEnded) {
        emitter.emit('ended', { id: toValue(id), value: newEnded })
      }
    })

    watch(fullscreen, (newFullscreen, oldFullscreen) => {
      if (newFullscreen !== oldFullscreen) {
        emitter.emit('fullscreen', { id: toValue(id), value: newFullscreen })
      }
    })

    watch(loaded, (newLoaded, oldLoaded) => {
      if (newLoaded !== oldLoaded) {
        emitter.emit('loaded', { id: toValue(id), value: newLoaded })
      }
    })

    watch(muted, (newMuted, oldMuted) => {
      if (newMuted !== oldMuted) {
        emitter.emit('muted', { id: toValue(id), value: newMuted })
      }
    })

    watch(paused, (newPaused, oldPaused) => {
      if (newPaused !== oldPaused) {
        emitter.emit('paused', { id: toValue(id), value: newPaused })
      }
    })

    watch(playing, (newPlaying, oldPlaying) => {
      if (newPlaying !== oldPlaying) {
        emitter.emit('playing', { id: toValue(id), value: newPlaying })
      }
    })

    watch(rate, (newRate, oldRate) => {
      if (newRate !== oldRate) {
        emitter.emit('rate', { id: toValue(id), value: newRate })
      }
    })

    watch(seeking, (newSeeking, oldSeeking) => {
      if (newSeeking !== oldSeeking) {
        emitter.emit('seeking', { id: toValue(id), value: newSeeking })
      }
    })

    watch(started, (newStarted, oldStarted) => {
      if (newStarted !== oldStarted) {
        emitter.emit('started', { id: toValue(id), value: newStarted })
      }
    })

    watch(stalled, (newStalled, oldStalled) => {
      if (newStalled !== oldStalled) {
        emitter.emit('stalled', { id: toValue(id), value: newStalled })
      }
    })

    watch(touched, (newTouched, oldTouched) => {
      if (newTouched !== oldTouched) {
        emitter.emit('touched', { id: toValue(id), value: newTouched })
      }
    })

    watch(volume, (newVolume, oldVolume) => {
      if (newVolume !== oldVolume) {
        emitter.emit('volume', { id: toValue(id), value: newVolume })
      }
    })

    watch(waiting, (newWaiting, oldWaiting) => {
      if (newWaiting !== oldWaiting) {
        emitter.emit('waiting', { id: toValue(id), value: newWaiting })
      }
    })
  }

  return {
    initializeEmitter,
  }
}

export type UsePlayerEmitterReturn = ReturnType<typeof usePlayerEmitter>
