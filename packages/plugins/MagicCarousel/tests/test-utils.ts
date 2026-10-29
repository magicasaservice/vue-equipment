import { defineComponent } from 'vue'

type DispatchPointerArgs = {
  target: EventTarget
  type: 'pointerdown' | 'pointermove' | 'pointerup'
  clientX: number
}

export function dispatchPointer(args: DispatchPointerArgs) {
  const { target, type, clientX } = args

  target.dispatchEvent(
    new PointerEvent(type, {
      clientX: clientX,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      bubbles: true,
      cancelable: true,
    })
  )
}

// Real drags interleave pointer moves with frames, the physics loop
// accumulates the deltas in between
export async function dragPointer(args: {
  target: EventTarget
  from: number
  to: number
  step: number
}) {
  const { target, from, to, step } = args
  const direction = to > from ? 1 : -1

  for (
    let clientX = from + step * direction;
    direction > 0 ? clientX <= to : clientX >= to;
    clientX += step * direction
  ) {
    dispatchPointer({ target, type: 'pointermove', clientX })
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
}

import MagicCarouselProvider from '../src/components/MagicCarouselProvider.vue'
import MagicCarouselTrack from '../src/components/MagicCarouselTrack.vue'
import MagicCarouselSlide from '../src/components/MagicCarouselSlide.vue'
import MagicCarouselTrigger from '../src/components/MagicCarouselTrigger.vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { TestId } from './enums'

export function createLoopedCarousel(carouselId: string, trackStyle: string) {
  return defineComponent({
    components: {
      MagicCarouselProvider,
      MagicCarouselTrack,
      MagicCarouselSlide,
    },
    template: `
      <MagicCarouselProvider
        id="${carouselId}"
        style="width: 300px"
        :options="{ loop: true }"
      >
        <MagicCarouselTrack data-test-id="${TestId.Track}" style="${trackStyle}">
          <MagicCarouselSlide
            v-for="index in 6"
            :key="index"
            data-test-id="${TestId.Slide}"
          >
            <div style="height: 100px;">{{ index }}</div>
          </MagicCarouselSlide>
        </MagicCarouselTrack>
      </MagicCarouselProvider>
    `,
  })
}

export function createCarousel(
  carouselId: string,
  options: Record<string, unknown> = {},
  slideCount = 6,
  slideSize = ''
) {
  return defineComponent({
    components: {
      MagicCarouselProvider,
      MagicCarouselTrack,
      MagicCarouselSlide,
      MagicCarouselTrigger,
    },
    setup() {
      const api = useMagicCarousel(carouselId)
      return { ...api }
    },
    template: `
      <div>
        <button data-test-id="${TestId.Next}" @click="next()">Next</button>
        <button data-test-id="${TestId.Previous}" @click="previous()">Previous</button>
        <button data-test-id="${TestId.SnapTo}" @click="snapTo(2)">SnapTo</button>
        <span data-test-id="${TestId.ActiveIndex}">{{ activeIndex }}</span>
        <span data-test-id="${TestId.SlideCount}">{{ slideCount }}</span>
        <span data-test-id="${TestId.Progress}">{{ progress }}</span>
        <MagicCarouselProvider id="${carouselId}" :options="options">
          <MagicCarouselTrack
            data-test-id="${TestId.Track}"
            style="width: 300px; --magic-carousel-slides-per-track: 3; --magic-carousel-gap: 0px; ${slideSize ? `--magic-carousel-slide-size: ${slideSize};` : ''}"
          >
            <MagicCarouselSlide
              v-for="index in ${slideCount}"
              :key="index"
              data-test-id="${TestId.Slide}"
            >
              <div style="height: 100px;">{{ index }}</div>
            </MagicCarouselSlide>
          </MagicCarouselTrack>
          <MagicCarouselTrigger data-test-id="${TestId.TriggerPrevious}" action="previous" />
          <MagicCarouselTrigger data-test-id="${TestId.TriggerNext}" action="next" />
        </MagicCarouselProvider>
      </div>
    `,
    data() {
      return { options }
    },
  })
}
