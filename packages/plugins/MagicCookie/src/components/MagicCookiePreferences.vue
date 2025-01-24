<template>
  <div v-if="wrapperActive" class="magic-cookie-preferences">
    <magic-auto-size :width="false">
      <transition
        :name="options.transition?.preferences"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
      >
        <div v-show="innerActive" class="magic-cookie-preferences__list">
          <ul>
            <li
              v-for="cookie in cookies"
              :key="cookie.key"
              class="magic-cookie-preferences__item"
            >
              <magic-cookie-checkbox :cookie="cookie" @change="toggleCookie" />
              <div>
                <slot :name="cookie.key" :cookie="cookie">
                  <div class="magic-cookie-preferences__cookie-content">
                    <div
                      class="magic-cookie-preferences__cookie-content__title"
                    >
                      <span v-text="cookie.title" />
                    </div>
                    <div
                      v-if="cookie.text"
                      class="magic-cookie__cookie-content-text"
                      v-html="cookie.text"
                    />
                  </div>
                </slot>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </magic-auto-size>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, nextTick, watch } from 'vue'
import { useMagicCookie } from '../composables/useMagicCookie'
import {
  MagicCookieId,
  MagicCookieList,
  MagicCookieOptionsKey,
} from '../../symbols'
import { useCookieCallback } from '../composables/private/useCookieCallback'

const id = inject(MagicCookieId, undefined)
const cookies = inject(MagicCookieList, [])
const options = inject(MagicCookieOptionsKey, undefined)

if (!id || !options) {
  throw new Error('MagicCookiePreferences must be used inside MagicCookie')
}

const { preferencesVisible, toggleCookie } = useMagicCookie(id)

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

watch(preferencesVisible, async (value) => {
  if (value) {
    await onOpen()
  } else {
    onClose()
  }
})
</script>

<style>
.magic-cookie-preferences {
  width: 100%;
  --magic-auto-size-transition: var(
    --magic-cookie-preferences-size-transition,
    all 200ms var(--ease-in-out-sharp) ;
  );
  clip-path: var(--magic-cookie-content-clip-path, inset(0));
}

.magic-cookie-preferences__list {
  margin: 0;
  & ul {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--magic-cookie-preferences-list-gap, 1rem);
    list-style: none;
    padding: var(--magic-cookie-preferences-list-padding-top, 1rem) 0 0 0;
  }
}

li.magic-cookie-preferences__item {
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--magic-cookie-preferences-item-gap, 1rem);
  align-items: baseline;
}

.magic-cookie-preferences__cookie-content {
  display: flex;
  flex-direction: column;
  gap: var(--magic-cookie-preferences-cookie-content-gap, 0);
  align-items: flex-start;
}

.magic-cookie-preferences__cookie-content__title {
  display: inline-flex;
}

.magic-cookie-preferences__cookie-content__text {
  white-space: pre-line;
}

.magic-cookie-preferences-enter-active {
  position: relative;
  transition: var(
    --magic-cookie-preferences-enter-transition,
    fade-in 150ms var(--ease-in-out)
  );
}

.magic-cookie-preferences-leave-active {
  transition: var(
    --magic-cookie-preferences-leave-transition,
    all 200ms var(--ease-in-out-sharp)
  );
  height: 0;
}
</style>
