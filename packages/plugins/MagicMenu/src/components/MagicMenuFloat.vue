<template>
  <div class="magic-menu-float" ref="elRef" :style="floatingStyles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, toValue } from 'vue'
import { useFloating, autoUpdate, flip, type Placement } from '@floating-ui/vue'
import { MagicMenuInstanceId, MagicMenuParentTree } from '../symbols'

interface MagicMenuFloatProps {
  parentId: HTMLElement
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'right-start'
    | 'right-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
}

const props = defineProps<MagicMenuFloatProps>()

const elRef = ref<HTMLElement | undefined>(undefined)
const referenceEl = ref<HTMLElement | null>(null)

const instanceId = inject(MagicMenuInstanceId, undefined)
const parentTree = inject(MagicMenuParentTree, [toValue(instanceId)])

const nestingLevel = computed(() => parentTree.length)

const mappedPlacement = computed((): Placement => {
  // +1 Since this element is nested inside a MagicMenuView
  return props.placement || nestingLevel.value <= 2
    ? 'bottom-start'
    : 'right-start'
})

const { floatingStyles } = useFloating(referenceEl, elRef, {
  placement: mappedPlacement,
  whileElementsMounted: autoUpdate,
  middleware: [flip()],
})

watch(
  () => props.parentId,
  (value) => {
    referenceEl.value = document.querySelector('#' + value)
  },
  { immediate: true }
)
</script>
