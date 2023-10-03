<template>
  <client-only>
    <div class="magic-consent">
      <div class="magic-consent__container">
        <div class="magic-consent__body">
          <slot />
          <div v-show="preferencesVisible" class="magic-consent__preferences">
            <ul class="magic-consent__cookies">
              <li
                v-for="cookie in cookies"
                :key="cookie.key"
                class="magic-consent__cookie"
              >
                <div class="magic-consent-checkbox">
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
                    <div class="magic-consent__cookie__content">
                      <div class="magic-consent__cookie__title">
                        <span v-text="cookie.title" />
                      </div>
                      <div
                        v-if="cookie.text"
                        class="magic-consent__cookie__text"
                        v-html="cookie.text"
                      />
                    </div>
                  </slot>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="magic-consent__footer">
          <slot name="actions">
            <div class="magic-consent__actions">
              <template v-if="preferencesVisible">
                <button
                  class="magic-consent-button -secondary"
                  @click="preferencesVisible = !preferencesVisible"
                >
                  Close
                </button>
                <button
                  class="magic-consent-button -secondary"
                  @click="acceptSelected"
                >
                  Accept selected
                </button>
              </template>
              <template v-else>
                <button
                  class="magic-consent-button -secondary"
                  @click="preferencesVisible = true"
                >
                  Preferences
                </button>
                <button class="magic-consent-button -secondary" @click="reject">
                  Reject
                </button>
              </template>
              <button class="magic-consent-button -primary" @click="accept">
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
import { defineConsentApi } from '../composables/private/defineConsentApi'
import { useConsentApi } from '../composables/useConsentApi'
import type { ConsentCookieRecord } from '../types'

// Define the props and their default values
type Props = {
  cookies: ConsentCookieRecord[]
  maxAge?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxAge: 60 * 60 * 24 * 30,
})

// Initialize the Consent API
defineConsentApi({
  cookies: props.cookies,
  maxAge: props.maxAge,
})

// Use the Consent API
const {
  preferencesVisible,
  selectedCookies,
  accept,
  acceptSelected,
  reject,
  toggleSelection,
} = useConsentApi()
</script>

<style lang="css">
:root {
  --magic-consent-max-width: 480px;
  --magic-consent-max-height: calc(100vh - 2rem);
  --magic-consent-background-color: rgba(75, 75, 75, 0.5);
  --magic-consent-backdrop-filter: blur(32px);
  --magic-consent-color: rgba(255, 255, 255);
  --magic-consent-border-radius: 0;
  --magic-consent-box-shadow: none;
  --magic-consent-preferences-mask: linear-gradient(
    to top,
    rgb(255 255 255 / 0%),
    rgb(255 255 255 / 100%) 1.5rem
  );
  --magic-consent-checkbox-size: 0.875rem;
  --magic-consent-checkbox-border-width: 1px;
  --magic-consent-checkbox-border-color: currentColor;
  --magic-consent-checkbox-border-radius: 0;

  --magic-consent-button-width: auto;
  --magic-consent-button-height: 2.5rem;
  --magic-consent-button-spacing: 1rem;
  --magic-consent-button-border-width: 1px;
  --magic-consent-button-border-radius: 0.25rem;
  --magic-consent-button-backdrop-filter: none;

  --magic-consent-button-primary-color: rgb(0, 0, 0);
  --magic-consent-button-primary-background-color: rgb(255 255 255);
  --magic-consent-button-primary-border-color: transparent;

  --magic-consent-button-secondary-color: rgb(255, 255, 255);
  --magic-consent-button-secondary-background-color: transparent;
  --magic-consent-button-secondary-border-color: transparent;
}

.magic-consent {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--magic-consent-max-width);
  border-radius: var(--magic-consent-border-radius);
  background-color: var(--magic-consent-background-color);
  color: var(--magic-consent-color);
  box-shadow: var(--magic-consent-box-shadow);
  backdrop-filter: var(--magic-consent-backdrop-filter);
  -webkit-backdrop-filter: var(--magic-consent-backdrop-filter);
  overflow: hidden;
}

.magic-consent__container {
  width: 100%;
  max-height: var(--magic-consent-max-height);
  display: flex;
  flex-direction: column;
}

.magic-consent__body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  mask: var(--magic-consent-preferences-mask);
  -webkit-mask: var(--magic-consent-preferences-mask);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.magic-consent__body::-webkit-scrollbar {
  display: none;
}

.magic-consent__footer {
  width: 100%;
  padding: 1rem;
}

.magic-consent__preferences {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.magic-consent__actions {
  width: 100%;
  display: flex;
  gap: 1rem;
}

ul.magic-consent__cookies {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
}

li.magic-consent__cookie {
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.magic-consent__cookie__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.magic-consent__cookie__title {
  display: inline-flex;
}

.magic-consent__cookie__text {
  white-space: pre-line;
}

.magic-consent-checkbox {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}

.magic-consent-checkbox input[type='checkbox'] {
  position: relative;
  flex-shrink: 0;
  width: var(--magic-consent-checkbox-size);
  height: var(--magic-consent-checkbox-size);
  background-color: transparent;
  border: var(--magic-consent-checkbox-border-width)
    var(--magic-consent-checkbox-border-color) solid;
  vertical-align: middle;
  cursor: pointer;
  appearance: none;
  border-radius: var(--magic-consent-checkbox-border-radius);
}

.magic-consent-checkbox input[type='checkbox']:checked::after {
  content: '';
  display: block;
  position: absolute;
  width: calc(var(--magic-consent-checkbox-size) / 2);
  height: calc(var(--magic-consent-checkbox-size) / 2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--magic-consent-checkbox-border-color);
  border-radius: var(--magic-consent-checkbox-border-radius);
}

.magic-consent-checkbox:disabled {
  cursor: not-allowed;
}

.magic-consent-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--magic-consent-button-width);
  height: var(--magic-consent-button-height);
  border: var(--magic-consent-button-border-width) solid currentColor;
  padding: 0 var(--magic-consent-button-spacing);
  gap: var(--magic-consent-button-spacing);
  border-radius: var(--magic-consent-button-border-radius);
  backdrop-filter: var(--magic-consent-button-backdrop-filter);
  -webkit-backdrop-filter: var(--magic-consent-button-backdrop-filter);
}

.magic-consent-button.-primary {
  color: var(--magic-consent-button-primary-color);
  background-color: var(--magic-consent-button-primary-background-color);
  border-color: var(--magic-consent-button-primary-border-color);
}

.magic-consent-button.-secondary {
  color: var(--magic-consent-button-secondary-color);
  background-color: var(--magic-consent-button-secondary-background-color);
  border-color: var(--magic-consent-button-secondary-border-color);
}
</style>
