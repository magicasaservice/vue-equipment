import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick, ref } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import MagicDotMatrix from '../src/components/MagicDotMatrix.vue'
import {
  useMagicDotMatrix,
  type UseMagicDotMatrixReturn,
} from '../src/composables/useMagicDotMatrix'
import { MatrixId } from './enums'
import type { DotMatrixSequence, MagicDotMatrixOptions } from '../src/types'

function frames(count: number) {
  return Array.from({ length: count }, (_, index) => [index])
}

type RenderDotMatrixResult = {
  api: UseMagicDotMatrixReturn
  sequence: ReturnType<typeof ref<DotMatrixSequence>>
  finished: ReturnType<typeof vi.fn>
  frameChanged: ReturnType<typeof vi.fn>
}

function renderDotMatrix(
  matrixId: string,
  initialSequence: DotMatrixSequence,
  options: MagicDotMatrixOptions = {}
): RenderDotMatrixResult {
  let api: UseMagicDotMatrixReturn | undefined
  const sequence = ref(initialSequence)
  const finished = vi.fn()
  const frameChanged = vi.fn()

  render(
    defineComponent({
      components: { MagicDotMatrix },
      setup() {
        api = useMagicDotMatrix(matrixId)
        const emitter = useMagicEmitter()
        emitter.on('finish', finished)
        emitter.on('frameChange', frameChanged)
        return { sequence }
      },
      data() {
        return { options }
      },
      template: `
        <MagicDotMatrix id="${matrixId}" :sequence="sequence" :options="options" />
      `,
    })
  )

  return { api: api!, sequence, finished, frameChanged }
}

describe('MagicDotMatrix - API', () => {
  it('exposes state and playback controls', () => {
    const { api } = renderDotMatrix(MatrixId.ApiShape, frames(2))

    expect(api.state).toBeDefined()
    expect(api.isPlaying).toBeDefined()
    expect(api.currentFrame).toBeDefined()
    expect(typeof api.play).toBe('function')
    expect(typeof api.pause).toBe('function')
    expect(typeof api.restart).toBe('function')
  })

  it('advances frames while playing', async () => {
    const { api } = renderDotMatrix(MatrixId.ApiAdvance, frames(10), {
      interval: 20,
    })
    await nextTick()

    expect(api.isPlaying.value).toBe(true)
    await vi.waitFor(() => {
      expect(api.currentFrame.value).toBeGreaterThan(0)
    })
  })

  it('pauses and resumes playback', async () => {
    const { api } = renderDotMatrix(MatrixId.ApiPause, frames(10), {
      interval: 20,
    })
    await nextTick()

    const root = document.querySelector(`[data-id='${MatrixId.ApiPause}']`)
    expect(root!.getAttribute('data-playing')).toBe('true')

    api.pause()
    await nextTick()
    expect(root!.getAttribute('data-playing')).toBe('false')

    const pausedFrame = api.currentFrame.value
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(api.currentFrame.value).toBe(pausedFrame)

    api.play()
    await nextTick()
    expect(root!.getAttribute('data-playing')).toBe('true')
    await vi.waitFor(() => {
      expect(api.currentFrame.value).not.toBe(pausedFrame)
    })
  })

  it('restarts from the first frame', async () => {
    const { api } = renderDotMatrix(MatrixId.ApiRestart, frames(10), {
      interval: 20,
    })
    await nextTick()

    await vi.waitFor(() => {
      expect(api.currentFrame.value).toBeGreaterThan(1)
    })

    api.pause()
    api.restart()
    await nextTick()

    expect(api.currentFrame.value).toBe(0)
    expect(api.isPlaying.value).toBe(true)
  })

  it('emits frameChange with the instance id and frame index', async () => {
    const { frameChanged } = renderDotMatrix(
      MatrixId.ApiFrameChange,
      frames(10),
      { interval: 20 }
    )
    await nextTick()

    await vi.waitFor(() => {
      expect(frameChanged).toHaveBeenCalledWith({
        id: MatrixId.ApiFrameChange,
        frame: 1,
      })
    })
  })

  it('resets to the first frame when the sequence changes', async () => {
    const { api, sequence } = renderDotMatrix(
      MatrixId.ApiSeqReset,
      frames(10),
      { interval: 20 }
    )
    await nextTick()

    await vi.waitFor(() => {
      expect(api.currentFrame.value).toBeGreaterThan(0)
    })

    api.pause()
    sequence.value = frames(5)
    await nextTick()

    expect(api.currentFrame.value).toBe(0)
  })

  it('plays once when loop is disabled', async () => {
    const { api, finished } = renderDotMatrix(MatrixId.ApiLoopOnce, frames(3), {
      interval: 20,
      loop: false,
    })
    await nextTick()

    await vi.waitFor(() => {
      expect(finished).toHaveBeenCalledWith({ id: MatrixId.ApiLoopOnce })
    })

    expect(api.isPlaying.value).toBe(false)
    expect(finished).toHaveBeenCalledTimes(1)
  })

  it('stops and emits finish after the configured loops', async () => {
    const { api, finished } = renderDotMatrix(MatrixId.ApiFinish, frames(3), {
      interval: 20,
      loop: 1,
    })
    await nextTick()

    await vi.waitFor(() => {
      expect(finished).toHaveBeenCalledWith({ id: MatrixId.ApiFinish })
    })

    expect(api.isPlaying.value).toBe(false)

    const root = document.querySelector(`[data-id='${MatrixId.ApiFinish}']`)
    expect(root!.getAttribute('data-playing')).toBe('false')
  })

  it('shares state between component and composable', async () => {
    const { api } = renderDotMatrix(MatrixId.StateShared, frames(5), {
      interval: 20,
    })
    await nextTick()

    expect(api.state.id).toBe(MatrixId.StateShared)
    expect(api.state.options.interval).toBe(20)
  })
})
