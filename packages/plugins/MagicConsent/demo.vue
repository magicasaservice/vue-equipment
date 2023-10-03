<template>
  <magic-consent>
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
  </magic-consent>
</template>

<script lang="ts" setup>
import { useConsentApi } from './src/composables/useConsentApi'

const { onAccept, onAcceptSelected, onReject } = useConsentApi()

const consentCookies = [
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

onAccept((consent) => {
  console.log('ACCEPT:', consent.cookies)

  if (consent.cookies.statistics) {
    // Enable statistics cookies here
    console.log('Statistics cookies enabled')
  }

  if (consent.cookies.marketing) {
    // Enable marketing cookies here
    console.log('Marketing cookies enabled')
  }

  if (consent.cookies.preferences) {
    // Enable preferences cookies here
    console.log('Preferences cookies enabled')
  }
})

onAcceptSelected((consent) => {
  console.log('ACCEPT_SELECTED:', consent.cookies)

  if (consent.cookies.statistics) {
    // Enable statistics cookies here
    console.log('Statistics cookies enabled')
  } else if (consent.cookies.statistics === false) {
    // Disable statistics cookies here if not already disabled
    console.log('Statistics cookies disabled!')
  }

  if (consent.cookies.marketing) {
    // Enable marketing cookies here
    console.log('Marketing cookies enabled')
  } else if (consent.cookies.marketing === false) {
    // Disable marketing cookies here if not already disabled
    console.log('Marketing cookies disabled!')
  }

  if (consent.cookies.preferences) {
    // Enable preferences cookies here
    console.log('Preferences cookies enabled')
  } else if (consent.cookies.preferences === false) {
    // Disable preferences cookies here if not already disabled
    console.log('Preferences cookies disabled!')
  }
})

onReject((consent) => {
  console.log('REJECT:', consent.cookies)

  if (consent.cookies.statistics === false) {
    // Disable statistics cookies here
    console.log('Statistics cookies disabled!')
  }

  if (consent.cookies.marketing === false) {
    // Disable marketing cookies here
    console.log('Marketing cookies disabled!')
  }

  if (consent.cookies.preferences === false) {
    // Disable preferences cookies here
    console.log('Preferences cookies disabled!')
  }
})
</script>
