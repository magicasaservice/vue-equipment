<template>
  <div
    class="h-15 border-surface bg-surface-elevation-high relative flex items-center gap-1 overflow-hidden rounded-[1.25rem] p-1"
  >
    <magic-menu-provider
      v-if="menu"
      id="navigation-bar-demo"
      :options="{
        mode: 'navigation',
      }"
      class="flex"
    >
      <magic-menu-view ref="view">
        <div class="flex gap-1">
          <magic-menu-trigger
            v-for="(item, i) in menu"
            :key="i"
            as-child
            class="ui-menu-button"
          >
            <magic-menu-remote
              v-slot="{ channelActive }"
              :channel-id="item.id"
              as-child
            >
              <m-button :mode="channelActive ? 'translucent' : 'ghost'">
                <span class="flex items-center gap-2.5">
                  <span>{{ item.label }}</span>
                  <m-badge
                    v-if="item.badge"
                    mode="outline"
                    variant="primary"
                    size="sm"
                  >
                    {{ item.badge }}
                  </m-badge>
                </span>
              </m-button>
            </magic-menu-remote>
          </magic-menu-trigger>
        </div>
        <magic-menu-content :reference-el="viewRef?.$el">
          <div class="p-1 pt-2">
            <m-menu-box class="navigation-bar__menu-box overflow-hidden">
              <auto-size :duration="100">
                <magic-menu-channel
                  v-for="(item, i) in menu"
                  :id="item.id"
                  :key="i"
                  class="relative inline-flex gap-4"
                >
                  <div
                    v-for="(entry, j) in item.lists"
                    :key="j"
                    class="w-[16rem]"
                  >
                    <div
                      v-if="entry.label"
                      class="flex items-center gap-2 pb-2 pl-7 pt-4"
                    >
                      <span class="type-surface-callout-sm text-surface-muted">
                        {{ entry.label }}
                      </span>
                      <m-badge v-if="'badge' in entry" size="xs" mode="tone">
                        {{ entry.badge }}
                      </m-badge>
                    </div>

                    <menu-demo-card
                      v-for="(data, k) in entry.list"
                      :key="k"
                      :data="data"
                    />
                  </div>
                </magic-menu-channel>
              </auto-size>
            </m-menu-box>
          </div>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef, type ComponentPublicInstance } from 'vue'
import { AutoSize } from '@maas/vue-autosize'
import { MMenuBox, MBadge, MButton } from '@maas/mirror/vue'

import MenuDemoCard from './components/MenuDemoCard.vue'

const viewRef = useTemplateRef<ComponentPublicInstance>('view')

const menu = [
  {
    label: 'Catalogue',
    id: 'catalogue-channel',
    lists: [
      {
        label: 'Commercial',
        list: [
          {
            label: 'Mirror Ui',
            callout: 'Interface System',
            icon: 'maas-mr',
          },
          {
            label: 'Dreamtype™',
            badge: 'Soon',

            callout: 'Commercial Fonts',

            icon: 'maas-dt',
          },
          {
            label: 'Azzets',
            badge: 'Soon',
            callout: 'Visual Content App',
            icon: 'maas-az',
          },
        ],
      },
      {
        label: 'Open Source',
        badge: 'OSS',

        list: [
          {
            label: 'Vue Equipment',
            callout: 'Open Source Plugins',
            icon: 'maas-ve',
          },

          {
            label: 'Open Foundry',
            callout: 'Open Source Fonts',
            icon: 'maas-of',
          },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    id: 'resources-channel',
    lists: [
      {
        label: 'Company',
        list: [
          {
            label: 'Readme',
            badge: 'Blog',

            callout: 'Written by MaaS™',
            icon: 'edit-alt',
          },

          {
            label: 'About us',
            callout: 'Who we Are',
            icon: 'maas-robot',
          },
        ],
      },
      {
        label: 'Community',
        id: 'community-channel',
        list: [
          {
            icon: 'brand-github',
            label: 'GitHub',
            callout: 'What we Code',
          },

          {
            icon: 'brand-figma',
            label: 'Figma',
            badge: 'Soon',

            callout: 'Design Resources',
          },
        ],
      },
      {
        label: 'Packages',
        badge: 'OSS',

        list: [
          {
            icon: 'brand-vue',
            label: 'Vue Primitive',
            callout: '@maas/vue-primitive',
          },

          {
            icon: 'brand-nuxt',
            label: 'MagicImage',
            callout: '@maas/magic-image',
          },
        ],
      },
    ],
  },
  {
    label: 'Enterprise',
    id: 'enterprise-channel',
    badge: 'Pro',
    lists: [
      {
        label: 'Solutions',
        list: [
          {
            label: 'Mirror Ui',
            callout: 'Interface System',
            icon: 'maas-mr',
          },
          {
            label: 'Vue Equipment',
            callout: 'Frontend Toolkit',
            icon: 'maas-ve',
          },
        ],
      },
      {
        label: 'Group',
        list: [
          {
            label: 'International Magic',
            callout: 'Creative Studio',
          },

          {
            label: 'ONE',
            callout: 'Production Collective',
          },
        ],
      },
    ],
  },
]
</script>

<style>
.navigation-bar__menu-box {
  --menu-box-box-shadow: none;
  --menu-box-color-bg: theme('backgroundColor.surface.elevation.high.DEFAULT');
}
</style>
