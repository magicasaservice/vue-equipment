<template>
  <vue-primitive
    :data-id="id"
    :as-child="asChild"
    class="magic-carousel-provider"
  >
    <slot />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { provide, watch  } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import { useCarouselState } from '../composables/private/useCarouselState'
import { MagicCarouselInstanceId } from '../symbols'
import type {MaybeRef} from 'vue';
import type { MagicCarouselOptions } from '../types'

interface MagicCarouselProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicCarouselOptions
}

const { id, asChild, options } = defineProps<MagicCarouselProviderProps>()

const { initializeState } = useCarouselState(id)
initializeState(options)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  { deep: true }
)

provide(MagicCarouselInstanceId, id)
</script>

<style>
.magic-carousel-provider {
  container-type: inline-size;
}
</style>
