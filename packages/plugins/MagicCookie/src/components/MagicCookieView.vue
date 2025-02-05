<template>
  <div class="magic-cookie-view">
    <magic-auto-size :width="false">
      <transition
        :name="state.options.transition?.view"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
      >
        <div v-show="state.viewActive" class="magic-cookie-view__inner">
          <slot />
        </div>
      </transition>
    </magic-auto-size>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useCookieState } from '../composables/private/useCookieState'
import { useCookieCallback } from '../composables/private/useCookieCallback'

import { MagicCookieInstanceId } from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/squash-y.css'
import '@maas/vue-equipment/utils/css/easings.css'

const instanceId = inject(MagicCookieInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicCookiePreferences must be used inside MagicCookie')
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
  --magic-auto-size-transition: var(
    --magic-cookie-view-size-transition,
    all 200ms var(--ease-in-out)
  );
  clip-path: var(--magic-cookie-view-clip-path, inset(0));
}

.magic-cookie-view-enter-active {
  animation: fade-in 200ms var(--ease-in-out);
}

@keyframes squash-y-fade {
  0% {
    opacity: 1;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

.magic-cookie-view-leave-active {
  animation: squash-y-fade 200ms var(--ease-in-out);
}
</style>
