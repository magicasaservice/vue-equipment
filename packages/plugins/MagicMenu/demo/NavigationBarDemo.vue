<template>
  <magic-menu-provider
    id="magic-menu--navigation"
    :options="{ mode: 'navigation' }"
  >
    <magic-menu-view>
      <div
        ref="navigationRef"
        class="w-full flex bg-gray rounded-2xl bg-surface-elevation-base"
      >
        <magic-menu-remote channel-id="a" as-child>
          <m-button mode="ghost"> Home </m-button>
        </magic-menu-remote>

        <magic-menu-remote channel-id="b" as-child>
          <m-button mode="ghost">Events</m-button>
        </magic-menu-remote>

        <magic-menu-remote channel-id="c" as-child>
          <m-button mode="ghost">Projects</m-button>
        </magic-menu-remote>

        <m-button mode="ghost">External Link</m-button>

        <magic-menu-remote channel-id="d" as-child>
          <m-button mode="ghost">FAQ</m-button>
        </magic-menu-remote>
      </div>
      <magic-menu-content :reference-el="navigationRef">
        <div class="p-1">
          <magic-auto-size class="bg-surface-elevation-base rounded-2xl">
            <magic-menu-channel id="a" class="w-[40rem]">
              <m-menu-card>
                <m-menu-card-child>
                  <span>Title</span>
                  <span>Subtitle</span>
                </m-menu-card-child>
              </m-menu-card>
              <m-menu-card>
                <m-menu-card-child>
                  <span>Title</span>
                  <span>Subtitle</span>
                </m-menu-card-child>
              </m-menu-card>
              <m-menu-card>
                <m-menu-card-child>
                  <span>Title</span>
                  <span>Subtitle</span>
                </m-menu-card-child>
              </m-menu-card>
            </magic-menu-channel>
            <magic-menu-channel id="b" class="w-[50rem] h-[20rem]">
              Events Channel
            </magic-menu-channel>
            <magic-menu-channel id="c" class="w-[40rem] h-[20rem]">
              Projects Channel
            </magic-menu-channel>
            <magic-menu-channel id="d" class="w-[50rem] h-[20rem]">
              FAQ Channel
            </magic-menu-channel>
          </magic-auto-size>
        </div>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MMenuCard, MMenuCardChild, MButton } from '@maas/mirror/vue'

const navigationRef = ref<HTMLElement | null>(null)
</script>
