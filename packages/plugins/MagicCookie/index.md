# Magic Cookie

A magic plugin to manage cookies and user

## Usage

```vue
<template>
  <magic-cookie :cookies="cookies">
    <template #default>
      <div>
        We use cookies to provide a personalized experience based on your
        activity. You can adjust your preferences and read our Cookie Policy for
        more information.
      </div>
    </template>
    <template #functional="{ cookie }">
      <span>{{ cookie.title }}</span>
      <span>
        You can use slots to customize the cookie content. The template name
        must be the same as the cookie key.
      </span>
    </template>
    <template #actions>
      <div class="flex justify-end gap-4">
        <button @click="preferencesVisible = !preferencesVisible">
          {{ preferencesVisible ? 'Close' : 'Preferences' }}
        </button>
        <button @click="reject">Reject</button>
        <button @click="accept">Accept</button>
      </div>
    </template>
  </magic-cookie>
</template>

<script lang="ts" setup>
import { useMagicCookie } from '@maas/vue-equipment/plugins'

const {
  preferencesVisible,
  accept,
  reject,
  onAccept,
  onAcceptSelected,
  onReject,
} = useMagicCookie()

const cookies = [
  {
    key: 'functional', // key is required
    optional: false, // mark as necessary
    title: 'Functional',
    text: 'This is a necessary cookie and can NOT be disabled.',
  },
  {
    key: 'language', // key is required
    optional: false, // mark as necessary
    title: 'Language settings',
    text: 'This is a necessary cookie and can NOT be disabled.',
  },
  {
    key: 'statistics', // key is required
    title: 'Statistics',
    text: 'This is a optional cookie and can be disabled',
  },
  {
    key: 'marketing', // key is required
    title: 'Marketing',
    text: 'This is a optional cookie and can be disabled',
  },
  {
    key: 'preferences', // key is required
    title: 'Preferences',
    text: 'This is a optional cookie and can be disabled',
  },
]

onAccept(({ cookies }) => {
  console.log('ACCEPT:', cookies)

  if (cookies.statistics) {
    // Enable statistics cookies here
    console.log('Statistics cookies enabled')
  }

  if (cookies.marketing) {
    // Enable marketing cookies here
    console.log('Marketing cookies enabled')
  }

  if (cookies.preferences) {
    // Enable preferences cookies here
    console.log('Preferences cookies enabled')
  }
})

onAcceptSelected(({ cookies }) => {
  console.log('ACCEPT_SELECTED:', cookies)

  if (cookies.statistics) {
    // Enable statistics cookies here
    console.log('Statistics cookies enabled')
  } else if (cookies.statistics === false) {
    // Disable statistics cookies here if not already disabled
    console.log('Statistics cookies disabled!')
  }

  if (cookies.marketing) {
    // Enable marketing cookies here
    console.log('Marketing cookies enabled')
  } else if (cookies.marketing === false) {
    // Disable marketing cookies here if not already disabled
    console.log('Marketing cookies disabled!')
  }

  if (cookies.preferences) {
    // Enable preferences cookies here
    console.log('Preferences cookies enabled')
  } else if (cookies.preferences === false) {
    // Disable preferences cookies here if not already disabled
    console.log('Preferences cookies disabled!')
  }
})

onReject(({ cookies }) => {
  console.log('REJECT:', cookies)

  if (cookies.statistics === false) {
    // Disable statistics cookies here
    console.log('Statistics cookies disabled!')
  }

  if (cookies.marketing === false) {
    // Disable marketing cookies here
    console.log('Marketing cookies disabled!')
  }

  if (cookies.preferences === false) {
    // Disable preferences cookies here
    console.log('Preferences cookies disabled!')
  }
})
</script>
```
