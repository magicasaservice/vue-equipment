<template>
  <vue-primitive
    ref="el"
    class="magic-carousel-slide"
    :as-child="asChild"
    :data-id="mappedId"
    :data-active="slide.active || null"
    :style="mappedStyle"
  >
    <slot :active="slide.active" :index="mappedIndex" />
  </vue-primitive>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  useId,
  useTemplateRef,
} from 'vue'
import { unrefElement } from '@vueuse/core'
import { VuePrimitive } from '@maas/vue-primitive'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { MagicCarouselInstanceId } from '../symbols'
import { useCarouselState } from '../composables/private/useCarouselState'
import { useCarouselSlides } from '../composables/private/useCarouselSlides'

interface MagicCarouselSlideProps {
  id?: string
  asChild?: boolean
}

const { id, asChild } = defineProps<MagicCarouselSlideProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCarousel',
  source: 'MagicCarouselSlide',
})

const instanceId = inject(MagicCarouselInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicCarouselSlide must be nested inside MagicCarouselProvider',
  errorCode: 'missing_instance_id',
})

const uuid = useId()
const mappedId = computed(() => id ?? `magic-carousel-slide-${uuid}`)

const elRef = useTemplateRef<InstanceType<typeof VuePrimitive>>('el')

const { initializeState } = useCarouselState(instanceId)
const state = initializeState()

const { initializeSlide, connectSlide, deleteSlide } =
  useCarouselSlides(instanceId)

const slide = initializeSlide({ id: mappedId.value })

const mappedIndex = computed(() =>
  state.slides.findIndex((entry) => entry.id === mappedId.value)
)

const mappedStyle = computed(() => ({
  '--mc-loop-x': `${slide.loopOffset}px`,
}))

onMounted(() => {
  const el = unrefElement(elRef)

  if (el instanceof HTMLElement) {
    connectSlide(mappedId.value, el)
  }
})

onBeforeUnmount(() => {
  deleteSlide(mappedId.value)
})
</script>

<style>
.magic-carousel-slide {
  scroll-snap-align: var(--magic-carousel-snap-align, start);
  scroll-snap-stop: var(--magic-carousel-snap-stop, normal);
  translate: var(--mc-loop-x, 0px) 0;
}
</style>
