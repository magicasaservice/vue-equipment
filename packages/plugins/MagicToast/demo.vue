<template>
  <div class="w-full flex items-center justify-center gap-4">
    <m-button @click="onClick" class="w-full h-full px-6 py-4">
      Add toast
    </m-button>
    <m-button @click="clear" class="w-full h-full px-6 py-4">
      Clear all
    </m-button>
  </div>
  <magic-toast :id="id" :class="position" />
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  ref,
  computed,
  unref,
  onBeforeUnmount,
} from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { MButton } from '@maas/mirror/vue'
import {
  useMagicToast,
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { type ValueOf } from '@maas/vue-equipment/utils'

const count = ref(0)
const props = computed(() => {
  const message =
    count.value % 5
      ? `Added ${count.value} toasts`
      : `Extended text for toast ${count.value} so that it is a bit larger in height for demonstration purposes`
  return { message }
})

const component = defineAsyncComponent(() => import('./demo/DemoToast.vue'))

const id = 'magic-toast-demo'
const toastApi = useMagicToast(id)
const { add, clear } = toastApi

const isSmallScreen = useMediaQuery('(max-width: 1024px)')
const position = computed(() =>
  isSmallScreen.value ? '-bottom-center' : '-bottom-right'
)

function onClick() {
  count.value++
  add({ component, props: unref(props) })
}

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>
