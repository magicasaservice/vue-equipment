<template>
  <vue-primitive
    class="magic-carousel-trigger"
    as="button"
    type="button"
    :as-child="asChild"
    :data-action="action"
    :data-active="mappedActive || null"
    :data-disabled="mappedDisabled || null"
    :aria-disabled="mappedDisabled || undefined"
    @click="onClick"
  >
    <slot :active="mappedActive" :disabled="mappedDisabled" />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import {
  useMagicError
  
} from '@maas/vue-equipment/plugins/MagicError'
import { MagicCarouselInstanceId } from '../symbols'
import { useMagicCarousel } from '../composables/useMagicCarousel'
import type {UseMagicErrorReturn} from '@maas/vue-equipment/plugins/MagicError';
import type { CarouselTriggerAction } from '../types'

interface MagicCarouselTriggerProps {
  action?: CarouselTriggerAction
  disabled?: boolean
  asChild?: boolean
}

const {
  action = 'next',
  disabled = false,
  asChild,
} = defineProps<MagicCarouselTriggerProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCarousel',
  source: 'MagicCarouselTrigger',
})

const instanceId = inject(MagicCarouselInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicCarouselTrigger must be nested inside MagicCarouselProvider',
  errorCode: 'missing_instance_id',
})

const { activeIndex, arrivedStart, arrivedEnd, previous, next, snapTo } =
  useMagicCarousel(instanceId)

const mappedActive = computed(
  () => typeof action === 'number' && action === activeIndex.value
)

const mappedDisabled = computed(() => {
  switch (action) {
    case 'previous':
      return disabled || arrivedStart.value
    case 'next':
      return disabled || arrivedEnd.value
    default:
      return disabled
  }
})

function onClick() {
  if (mappedDisabled.value) {
    return
  }

  switch (action) {
    case 'previous':
      previous()
      break
    case 'next':
      next()
      break
    default:
      snapTo(action)
  }
}
</script>

<style>
.magic-carousel-trigger {
  cursor: var(--magic-carousel-trigger-cursor, pointer);
}

.magic-carousel-trigger[data-disabled='true'] {
  cursor: var(--magic-carousel-trigger-cursor-disabled, not-allowed);
}
</style>
