<template>
  <client-only>
    <div class="magic-cookie">
      <div class="magic-cookie__container">
        <div class="magic-cookie__body">
          <slot />
          <div v-show="preferencesVisible" class="magic-cookie__preferences">
            <ul class="magic-cookie__cookies">
              <li
                v-for="cookie in cookies"
                :key="cookie.key"
                class="magic-cookie__cookie"
              >
                <div class="magic-cookie-checkbox">
                  <input
                    :id="cookie.key"
                    type="checkbox"
                    :checked="
                      cookie.optional === false
                        ? true
                        : selectedCookies[cookie.key]
                    "
                    @change="toggleSelection(cookie.key)"
                    :disabled="cookie.optional === false"
                  />
                </div>
                <div>
                  <slot :name="cookie.key" :cookie="cookie">
                    <div class="magic-cookie__cookie__content">
                      <div class="magic-cookie__cookie__title">
                        <span v-text="cookie.title" />
                      </div>
                      <div
                        v-if="cookie.text"
                        class="magic-cookie__cookie__text"
                        v-html="cookie.text"
                      />
                    </div>
                  </slot>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="magic-cookie__footer">
          <slot name="actions">
            <div class="magic-cookie__actions">
              <template v-if="preferencesVisible">
                <button
                  class="magic-cookie-button -secondary"
                  @click="preferencesVisible = !preferencesVisible"
                >
                  Close
                </button>
                <button
                  class="magic-cookie-button -secondary"
                  @click="acceptSelected"
                >
                  Accept selected
                </button>
              </template>
              <template v-else>
                <button
                  class="magic-cookie-button -secondary"
                  @click="preferencesVisible = true"
                >
                  Preferences
                </button>
                <button class="magic-cookie-button -secondary" @click="reject">
                  Reject
                </button>
              </template>
              <button class="magic-cookie-button -primary" @click="accept">
                Accept
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { useCookieApi } from '../composables/private/useCookieApi'
import { useMagicCookie } from '../composables/useMagicCookie'
import type { MagicCookieRecord } from '../types'

// Define the props and their default values
type MagicCookieProps = {
  cookies: MagicCookieRecord[]
  maxAge?: number
}

const props = withDefaults(defineProps<MagicCookieProps>(), {
  maxAge: 60 * 60 * 24 * 30,
})

// Initialize the Cookie API
useCookieApi({
  cookies: props.cookies,
  maxAge: props.maxAge,
})

const {
  preferencesVisible,
  selectedCookies,
  accept,
  acceptSelected,
  reject,
  toggleSelection,
} = useMagicCookie()
</script>

<style lang="css">
:root {
  --magic-cookie-max-width: 480px;
  --magic-cookie-max-height: calc(100vh - 2rem);
  --magic-cookie-background: rgba(75, 75, 75, 0.5);
  --magic-cookie-backdrop-filter: blur(32px);
  --magic-cookie-color: rgba(255, 255, 255);
  --magic-cookie-border-radius: 0;
  --magic-cookie-box-shadow: none;
  --magic-cookie-preferences-mask: linear-gradient(
    to top,
    rgb(255 255 255 / 0%),
    rgb(255 255 255 / 100%) 1.5rem
  );
  --magic-cookie-checkbox-size: 0.875rem;
  --magic-cookie-checkbox-border-width: 1px;
  --magic-cookie-checkbox-border-color: currentColor;
  --magic-cookie-checkbox-border-radius: 0;

  --magic-cookie-button-width: auto;
  --magic-cookie-button-height: 2.5rem;
  --magic-cookie-button-spacing: 1rem;
  --magic-cookie-button-border-width: 1px;
  --magic-cookie-button-border-radius: 0.25rem;
  --magic-cookie-button-backdrop-filter: none;

  --magic-cookie-button-primary-color: rgb(0, 0, 0);
  --magic-cookie-button-primary-background: rgb(255 255 255);
  --magic-cookie-button-primary-border-color: transparent;

  --magic-cookie-button-secondary-color: rgb(255, 255, 255);
  --magic-cookie-button-secondary-background: transparent;
  --magic-cookie-button-secondary-border-color: transparent;
}

.magic-cookie {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--magic-cookie-max-width);
  border-radius: var(--magic-cookie-border-radius);
  background-color: var(--magic-cookie-background);
  color: var(--magic-cookie-color);
  box-shadow: var(--magic-cookie-box-shadow);
  backdrop-filter: var(--magic-cookie-backdrop-filter);
  -webkit-backdrop-filter: var(--magic-cookie-backdrop-filter);
  overflow: hidden;
}

.magic-cookie__container {
  width: 100%;
  max-height: var(--magic-cookie-max-height);
  display: flex;
  flex-direction: column;
}

.magic-cookie__body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  mask: var(--magic-cookie-preferences-mask);
  -webkit-mask: var(--magic-cookie-preferences-mask);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.magic-cookie__body::-webkit-scrollbar {
  display: none;
}

.magic-cookie__footer {
  width: 100%;
  padding: 1rem;
}

.magic-cookie__preferences {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.magic-cookie__actions {
  width: 100%;
  display: flex;
  gap: 1rem;
}

ul.magic-cookie__cookies {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
}

li.magic-cookie__cookie {
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.magic-cookie__cookie__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.magic-cookie__cookie__title {
  display: inline-flex;
}

.magic-cookie__cookie__text {
  white-space: pre-line;
}

.magic-cookie-checkbox {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}

.magic-cookie-checkbox input[type='checkbox'] {
  position: relative;
  flex-shrink: 0;
  width: var(--magic-cookie-checkbox-size);
  height: var(--magic-cookie-checkbox-size);
  background-color: transparent;
  border: var(--magic-cookie-checkbox-border-width)
    var(--magic-cookie-checkbox-border-color) solid;
  vertical-align: middle;
  cursor: pointer;
  appearance: none;
  border-radius: var(--magic-cookie-checkbox-border-radius);
}

.magic-cookie-checkbox input[type='checkbox']:checked::after {
  content: '';
  display: block;
  position: absolute;
  width: calc(var(--magic-cookie-checkbox-size) / 2);
  height: calc(var(--magic-cookie-checkbox-size) / 2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--magic-cookie-checkbox-border-color);
  border-radius: var(--magic-cookie-checkbox-border-radius);
}

.magic-cookie-checkbox:disabled {
  cursor: not-allowed;
}

.magic-cookie-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--magic-cookie-button-width);
  height: var(--magic-cookie-button-height);
  border: var(--magic-cookie-button-border-width) solid currentColor;
  padding: 0 var(--magic-cookie-button-spacing);
  gap: var(--magic-cookie-button-spacing);
  border-radius: var(--magic-cookie-button-border-radius);
  backdrop-filter: var(--magic-cookie-button-backdrop-filter);
  -webkit-backdrop-filter: var(--magic-cookie-button-backdrop-filter);
}

.magic-cookie-button.-primary {
  color: var(--magic-cookie-button-primary-color);
  background-color: var(--magic-cookie-button-primary-background);
  border-color: var(--magic-cookie-button-primary-border-color);
}

.magic-cookie-button.-secondary {
  color: var(--magic-cookie-button-secondary-color);
  background-color: var(--magic-cookie-button-secondary-background);
  border-color: var(--magic-cookie-button-secondary-border-color);
}
</style>
