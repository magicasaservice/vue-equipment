<template>
  <teleport to="body" v-if="view?.active">
    <div class="magic-menu-content" :id="`${viewId}-content`">
      <magic-menu-float :placement="placement">
        <div class="magic-menu-content__inner" @mouseenter="onMouseenter">
          <slot />
        </div>
      </magic-menu-float>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { inject, provide } from 'vue'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
} from '../symbols'
import type { Placement } from '@floating-ui/vue'

interface MagicMenuContentProps {
  placement?: Placement
}

defineProps<MagicMenuContentProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { getView, selectView } = useMenuView(instanceId)
const view = getView(viewId)

function onMouseenter() {
  if (viewId) {
    selectView(viewId)
  }
}

provide(MagicMenuContentId, `${viewId}-content`)
</script>
