<template>
  <magic-cookie-provider
    id="magic-cookie-demo"
    :cookies="cookies"
    class="bg-surface-elevation-base p-8 rounded-surface-md flex flex-col max-w-xl"
  >
    <div class="type-surface-body-md">
      Vue Equipment does not use cookies to provide you a personalized
      experience based on your activity, but for good measure here is a cookie
      banner anyways.
    </div>
    <magic-cookie-view>
      <div class="flex flex-col gap-6 pt-6">
        <magic-cookie-item
          v-for="cookie in cookies"
          :id="cookie.id"
          :key="cookie.id"
          v-slot="{ item }"
          :optional="cookie.optional"
          class="flex flex-col gap-1"
        >
          <m-checkbox
            v-model="item.active"
            :disabled="cookie.optional === false"
            :label="cookie.title"
          />
          <div class="type-surface-caption text-surface-subtle pl-8">
            {{ cookie.text }}
          </div>
        </magic-cookie-item>
      </div>
    </magic-cookie-view>
    <div class="flex gap-4 pt-6">
      <template v-if="viewActive">
        <m-button mode="plain" block @click="toggleView">Close</m-button>
        <m-button mode="translucent" block @click="onSave"> Save </m-button>
      </template>
      <template v-else>
        <m-button mode="plain" block @click="onRejectAll">
          Reject All
        </m-button>
        <m-button mode="translucent" block @click="toggleView">
          Settings
        </m-button>
      </template>
      <m-button block @click="onAcceptAll">Accept All</m-button>
    </div>
  </magic-cookie-provider>
</template>

<script lang="ts" setup>
import { useMagicCookie } from '../src/composables/useMagicCookie'
import { MButton, MCheckbox } from '@maas/mirror/vue'

import type { MagicCookieCallbackArgs } from '../src/types'

const {
  viewActive,
  toggleView,
  hideView,
  acceptAll,
  rejectAll,
  acceptSelected,
  onAccept,
  onAcceptSelected,
  onReject,
} = useMagicCookie('magic-cookie-demo')

const cookies = [
  {
    id: 'neccessary',
    optional: false,
    title: 'Strictly Necessary Cookies',
    text: 'These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.',
    maxAge: 24 * 60 * 60 * 60 * 10,
  },
  {
    id: 'performance',
    title: 'Performance Cookies',
    text: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.',
  },
  {
    id: 'functional',
    title: 'Functional Cookies',
    text: 'These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.',
  },
]

function onRejectAll() {
  rejectAll()
  hideView()
}

function onAcceptAll() {
  acceptAll()
  hideView()
}

function onSave() {
  acceptSelected()
  hideView()
}

function onAcceptCallback(args: MagicCookieCallbackArgs) {
  console.log('ACCEPT:', args)

  switch (true) {
    case args.statistics:
      console.log('Statistics cookies enabled')
      break
    case args.marketing:
      console.log('Marketing cookies enabled')
      break
    case args.preferences:
      console.log('Preferences cookies enabled')
      break
  }
}

function onAcceptSelectedCallback(args: MagicCookieCallbackArgs) {
  console.log('ACCEPT SELECTED:', args)

  switch (args.statistics) {
    case true:
      console.log('Statistics cookies enabled')
      break
    case false:
      console.log('Statistics cookies disabled!')
      break
  }

  switch (args.marketing) {
    case true:
      console.log('Marketing cookies enabled')
      break
    case false:
      console.log('Marketing cookies disabled!')
      break
  }

  switch (args.preferences) {
    case true:
      console.log('Preferences cookies enabled')
      break
    case false:
      console.log('Preferences cookies disabled!')
      break
  }
}

function onRejectCallback(args: MagicCookieCallbackArgs) {
  console.log('REJECT:', args)

  switch (false) {
    case args.statistics:
      console.log('Statistics cookies disabled!')
      break
    case args.marketing:
      console.log('Marketing cookies disabled!')
      break
    case args.preferences:
      console.log('Preferences cookies disabled!')
      break
  }
}

onAccept(onAcceptCallback)
onAcceptSelected(onAcceptSelectedCallback)
onReject(onRejectCallback)
</script>
