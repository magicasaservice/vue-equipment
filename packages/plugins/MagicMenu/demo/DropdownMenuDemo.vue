<template>
  <magic-menu-provider id="magic-menu-dropdown" :options="{ mode: 'dropdown' }">
    <magic-menu-view id="dropdown-view" class="flex justify-center">
      <magic-menu-trigger>
        <m-button>Open</m-button>
      </magic-menu-trigger>
      <magic-menu-content :arrow="false">
        <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
          <magic-menu-item>
            <m-menu-item>New Tab</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>New Window</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>New Private Window</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <magic-menu-view>
              <magic-menu-trigger>
                <m-menu-item> More Tools </m-menu-item>
              </magic-menu-trigger>
              <magic-menu-content>
                <div
                  class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                >
                  <magic-menu-item>
                    <m-menu-item>Bookmark Manager</m-menu-item>
                  </magic-menu-item>
                  <magic-menu-item>
                    <m-menu-item>History</m-menu-item>
                  </magic-menu-item>
                  <magic-menu-item>
                    <m-menu-item>Downloads</m-menu-item>
                  </magic-menu-item>
                </div>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>Show Bookmarks</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>Show Full URLs</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>Christoph Jeworutzki</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>Robin Scholz</m-menu-item>
          </magic-menu-item>
        </div>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import { MMenuItem, MButton } from '@maas/mirror/vue'
</script>
