<template>
  <div class="magic-menu-bar" @click="onClick" role="menubar" tabindex="0">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, toValue } from 'vue'
import { MagicMenuInstanceId } from '../symbols'
import { useMenuState } from '../composables/private/useMenuState'

const instanceId = inject(MagicMenuInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuBar must be used inside a MagicMenuProvider')
}

const { findState } = useMenuState(toValue(instanceId))
const state = findState()

function onClick() {
  state.active.value = true
}
</script>
