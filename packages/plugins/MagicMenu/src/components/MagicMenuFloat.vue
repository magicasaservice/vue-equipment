<template>
  <div class="magic-menu-float" ref="elRef" :style="floatingStyles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, toValue } from 'vue'
import { useFloating, autoUpdate, flip, type Placement } from '@floating-ui/vue'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuParentTree,
} from '../symbols'

interface MagicMenuFloatProps {
  placement?: Placement
}

const props = defineProps<MagicMenuFloatProps>()

const elRef = ref<HTMLElement | undefined>(undefined)
const referenceEl = ref<HTMLElement | null>(null)

const instanceId = inject(MagicMenuInstanceId, undefined)
const parentTree = inject(MagicMenuParentTree, [toValue(instanceId)])
const viewId = inject(MagicMenuViewId, undefined)

const mappedPlacement = computed((): Placement => {
  return props.placement
    ? props.placement
    : toValue(parentTree).length === 2
    ? 'bottom-start'
    : 'right-start'
})

const { floatingStyles } = useFloating(referenceEl, elRef, {
  placement: mappedPlacement,
  whileElementsMounted: autoUpdate,
  middleware: [flip()],
})

watch(
  () => viewId,
  (value) => {
    referenceEl.value = document.querySelector(`#${value}-trigger`)
  },
  { immediate: true }
)
</script>

<style>
.magic-menu-float {
  z-index: var(--magic-menu-float-z-index, 999);
}
</style>
