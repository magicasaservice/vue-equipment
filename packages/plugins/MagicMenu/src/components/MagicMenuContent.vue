<template>
  <teleport to="body" v-if="view?.active">
    <div class="magic-menu-content" :id="`${viewId}-content`">
      <magic-menu-float>
        <div class="magic-menu-content__inner">
          <slot />
        </div>
      </magic-menu-float>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useMenuView } from '../composables/private/useMenuView'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be used inside a MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be used inside a MagicMenuView')
}

const { getView } = useMenuView(instanceId)
const view = getView(viewId)
</script>
