<template>
  <div class="flex w-72 max-w-full flex-col gap-3 select-none">
    <div
      ref="list"
      class="bg-surface-base rounded-surface-lg h-60 touch-pan-y overflow-y-auto overscroll-contain"
    >
      <ul class="flex flex-col p-2">
        <li
          v-for="row in rows"
          :key="row"
          class="type-surface-body-sm rounded-component-sm px-3 py-2"
        >
          Row {{ row }}
        </li>
      </ul>
    </div>
    <span class="type-surface-caption text-surface-muted px-1">
      {{ label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTouchIntent } from '@maas/vue-equipment/composables/useTouchIntent'

const list = ref<HTMLElement>()
const rows = Array.from({ length: 24 }, (_, index) => index + 1)

const { intent } = useTouchIntent({ target: list })

const label = computed(() => {
  switch (intent.value) {
    case 'scroll':
      return 'Scrolling'
    case 'swipe':
      return 'Swiping'
    default:
      return 'Press and move on the list'
  }
})
</script>
