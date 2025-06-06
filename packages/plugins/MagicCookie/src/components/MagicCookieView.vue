<template>
  <div
    class="magic-cookie-view"
    :style="{ '--mc-duration': `${state.options.animation?.duration}ms` }"
  >
    <auto-size :width="false">
      <transition
        :name="state.options.transition"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div v-show="state.viewActive" class="magic-cookie-view__inner">
          <slot :view-active="state.viewActive" />
        </div>
      </transition>
    </auto-size>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { AutoSize } from '@maas/vue-autosize'
import { useCookieState } from '../composables/private/useCookieState'
import { useCookieCallback } from '../composables/private/useCookieCallback'

import { MagicCookieInstanceId } from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/auto-size-out.css'

const instanceId = inject(MagicCookieInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicCookiePreferences must be used within a MagicCookieProvider'
  )
}

const { initializeState } = useCookieState(instanceId)
const state = initializeState()

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useCookieCallback(instanceId)
</script>

<style>
.magic-cookie-view {
  width: 100%;
  clip-path: var(--magic-cookie-view-clip-path, inset(0));
}

.magic-cookie-view-enter-active {
  position: relative;
  animation: fade-in var(--mc-duration) var(--ease-in-out);
}

.magic-cookie-view-leave-active {
  animation: auto-size-out var(--mc-duration) var(--ease-in-out);
}
</style>
