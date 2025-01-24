<template>
  <magic-cookie-provider id="magic-cookie-demo" :cookies="cookies">
    <div>
      We use cookies to provide a personalized experience based on your
      activity. Refer to our Cookie Policy for more information.
    </div>
    <magic-cookie-preferences />
    <template #footer>
      <magic-cookie-actions />
    </template>
  </magic-cookie-provider>
</template>

<script lang="ts" setup>
import { useMagicCookie } from './src/composables/useMagicCookie'
import type { MagicCookie, MagicCookieCallbackArgs } from './src/types'

const { onAccept, onAcceptSelected, onReject } =
  useMagicCookie('magic-cookie-demo')

const cookies: MagicCookie[] = [
  {
    key: 'functional', // key is required
    value: false,
    optional: false, // mark as necessary
    title: 'Functional',
    text: 'This is a necessary cookie that can not be disabled.',
  },
  {
    key: 'language', // key is required
    value: false,
    optional: false, // mark as necessary
    title: 'Language settings',
    text: 'This is a necessary cookie that can not be disabled.',
  },
  {
    key: 'statistics', // key is required
    value: false,
    title: 'Statistics',
    text: 'This is a optional cookie.',
  },
  {
    key: 'marketing', // key is required
    value: false,
    title: 'Marketing',
    text: 'This is a optional cookie.',
  },
  {
    key: 'preferences', // key is required
    value: false,
    title: 'Preferences',
    text: 'This is a optional cookie.',
  },
]

function onAcceptCallback(args: MagicCookieCallbackArgs) {
  const { cookies } = args
  console.log('ACCEPT:', cookies)

  switch (true) {
    case cookies.statistics:
      console.log('Statistics cookies enabled')
      break
    case cookies.marketing:
      console.log('Marketing cookies enabled')
      break
    case cookies.preferences:
      console.log('Preferences cookies enabled')
      break
  }
}

function onAcceptSelectedCallback(args: MagicCookieCallbackArgs) {
  const { cookies } = args
  console.log('ACCEPT SELECTED:', cookies)

  switch (cookies.statistics) {
    case true:
      console.log('Statistics cookies enabled')
      break
    case false:
      console.log('Statistics cookies disabled!')
      break
  }

  switch (cookies.marketing) {
    case true:
      console.log('Marketing cookies enabled')
      break
    case false:
      console.log('Marketing cookies disabled!')
      break
  }

  switch (cookies.preferences) {
    case true:
      console.log('Preferences cookies enabled')
      break
    case false:
      console.log('Preferences cookies disabled!')
      break
  }
}

function onRejectCallback(args: MagicCookieCallbackArgs) {
  const { cookies } = args
  console.log('REJECT:', cookies)

  switch (false) {
    case cookies.statistics:
      console.log('Statistics cookies disabled!')
      break
    case cookies.marketing:
      console.log('Marketing cookies disabled!')
      break
    case cookies.preferences:
      console.log('Preferences cookies disabled!')
      break
  }
}

onAccept(onAcceptCallback)
onAcceptSelected(onAcceptSelectedCallback)
onReject(onRejectCallback)
</script>
