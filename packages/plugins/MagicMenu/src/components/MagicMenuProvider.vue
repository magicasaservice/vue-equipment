<template>
  <div class="magic-menu-provider" ref="elRef">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, toValue, type MaybeRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

import { MagicMenuInstanceId } from '../symbols'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuKeyListener } from '../composables/private/useMenuKeyListener'

interface MagicMenuProviderProps {
  id: MaybeRef<string>
}

const props = defineProps<MagicMenuProviderProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const { findState } = useMenuState(props.id)
const state = findState()

const { unselectAllViews } = useMenuView(props.id)
const { unselectAllItems } = useMenuItem(props.id)

onClickOutside(
  elRef,
  () => {
    state.active.value = false
    unselectAllViews()
    unselectAllItems()
  },
  {
    ignore: ['.magic-menu-view', '.magic-menu-item'],
  }
)

useMenuKeyListener(toValue(props.id))

provide(MagicMenuInstanceId, props.id)
</script>
