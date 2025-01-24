<template>
  <div class="magic-cookie-actions">
    <template v-if="preferencesVisible">
      <magic-cookie-button mode="secondary" @click="togglePreferences">
        Close
      </magic-cookie-button>
      <magic-cookie-button mode="secondary" @click="acceptSelected">
        Accept selected
      </magic-cookie-button>
    </template>
    <template v-else>
      <magic-cookie-button mode="secondary" @click="showPreferences">
        Preferences
      </magic-cookie-button>
      <magic-cookie-button mode="secondary" @click="rejectAll">
        Reject All
      </magic-cookie-button>
    </template>
    <magic-cookie-button mode="primary" @click="acceptAll">
      Accept All
    </magic-cookie-button>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useMagicCookie } from '../composables/useMagicCookie'
import { MagicCookieId } from '../symbols'

const id = inject(MagicCookieId, undefined)

if (!id) {
  throw new Error('MagicCookieActions must be used inside MagicCookie')
}

const {
  preferencesVisible,
  acceptAll,
  acceptSelected,
  rejectAll,
  togglePreferences,
  showPreferences,
} = useMagicCookie(id)
</script>

<style>
.magic-cookie-actions {
  width: 100%;
  display: flex;
  gap: var(--magic-cookie-actions-gap, 1rem);
}
</style>
