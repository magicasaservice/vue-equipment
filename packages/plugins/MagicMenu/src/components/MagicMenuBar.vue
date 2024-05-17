<template>
  <div class="magic-menu-bar" @click="onClick" role="menubar" tabindex="0">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, provide, toValue } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { MagicMenuInstanceId, MagicMenuParentTree } from '../symbols'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuKeyListener } from '../composables/private/useMenuKeyListener'
import { uuid } from '@maas/vue-equipment/utils'

interface MagicMenuBarProps {
  id?: string
}

const props = defineProps<MagicMenuBarProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const mappedId = computed(() => {
  return props.id || `magic-menu-bar-${uuid()}`
})

if (!instanceId) {
  throw new Error('MagicMenuBar must be used inside a MagicMenuProvider')
}

const parentTree = inject(MagicMenuParentTree, [])

const mappedParentTree = computed(() => [
  ...toValue(parentTree),
  mappedId.value,
])

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

function onClick() {
  state.active.value = true
}

provide(MagicMenuParentTree, mappedParentTree.value)
</script>
