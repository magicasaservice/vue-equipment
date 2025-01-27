<template>
  <div v-show="wrapperActive" class="magic-cookie-view">
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
        <div v-show="innerActive" class="magic-cookie-view__inner">
          <slot />
        </div>
      </transition>
    </magic-auto-size>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, nextTick, watch, onMounted } from 'vue'
import { useMagicCookie } from '../composables/useMagicCookie'
import { useCookieState } from '../composables/private/useCookieState'
import { useCookieCallback } from '../composables/private/useCookieCallback'

import { MagicCookieInstanceId } from '../symbols'

const id = inject(MagicCookieInstanceId, undefined)

if (!id) {
  throw new Error('MagicCookiePreferences must be used inside MagicCookie')
}

const { initializeState } = useCookieState(id)
const state = initializeState()

const { viewActive } = useMagicCookie(id)

const innerActive = ref(false)
const wrapperActive = ref(false)

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useCookieCallback({
  id,
  wrapperActive,
})

async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
}

function onClose() {
  innerActive.value = false
}

watch(viewActive, async (value) => {
  if (value) {
    await onOpen()
  } else {
    onClose()
  }
})

onMounted(() => {
  if (viewActive.value) {
    wrapperActive.value = true
    innerActive.value = true
  }
})
</script>

<style>
.magic-cookie-view {
  width: 100%;
  --magic-auto-size-transition: var(
    --magic-cookie-view-size-transition,
    all 300ms var(--ease-in-out-sharp) ;
  );
  clip-path: var(--magic-cookie-view-clip-path, inset(0));
}

.magic-cookie-view-enter-active {
  position: relative;
  transition: var(
    --magic-cookie-view-enter-transition,
    fade-in 150ms var(--ease-in-out)
  );
}

.magic-cookie-view-leave-active {
  transition: var(
    --magic-cookie-view-leave-transition,
    all 200ms var(--ease-in-out-sharp)
  );
  height: 0;
}
</style>
