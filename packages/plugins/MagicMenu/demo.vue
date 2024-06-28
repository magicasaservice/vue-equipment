<template>
  <div class="w-full max-w-screen flex flex-col gap-24 items-center">
    <magic-menu-provider
      id="magic-menu--menubar"
      class="flex gap-2 rounded-2xl bg-surface-elevation-base"
    >
      <magic-menu-view>
        <magic-menu-trigger class="m-button -ghost">Edit</magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item class="w-full">Undo</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Redo </m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item class="w-full"> Find </m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item class="w-full">Search the web…</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Find…</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Find Next</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Find Previous</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Cut</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Copy</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Paste</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="m-button -ghost">File</magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item class="w-full">New Tab</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">New Window</m-menu-item>
            </magic-menu-item>
            <magic-menu-item :disabled="true">
              <m-menu-item class="w-full"> New Incognito Window </m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item class="w-full">Share</m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item :disabled="true">
                      <m-menu-item class="w-full" :disabled="true">
                        Email Link
                      </m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Messages</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Notes</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <magic-menu-view>
                        <magic-menu-trigger>
                          <m-menu-item class="w-full">Socials</m-menu-item>
                        </magic-menu-trigger>
                        <magic-menu-content>
                          <div
                            class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                          >
                            <magic-menu-item>
                              <m-menu-item class="w-full">
                                Instagram
                              </m-menu-item>
                            </magic-menu-item>
                            <magic-menu-item>
                              <m-menu-item class="w-full">
                                Threads
                              </m-menu-item>
                            </magic-menu-item>
                            <magic-menu-item>
                              <m-menu-item class="w-full">
                                Twitter
                              </m-menu-item>
                            </magic-menu-item>
                          </div>
                        </magic-menu-content>
                      </magic-menu-view>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Print</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="m-button -ghost">View</magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item class="w-full">Show Bookmarks</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Show Full URLs</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Reload</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Force Reload</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">ToggleFullscreen</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Hide Sidebar</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger>
          <m-button mode="ghost">Profiles</m-button>
        </magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item class="w-full">Christoph Jeworutzki</m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item class="w-full">User Settings</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Edit Profile</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Subscribtions</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item class="w-full"> Robin Scholz</m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item class="w-full">User Settings</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Edit Profile</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Subscribtions</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Edit…</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Add Profile…</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--dropdown"
      :options="{ mode: 'dropdown' }"
    >
      <magic-menu-view class="flex justify-center" id="dropdown-view">
        <magic-menu-trigger>
          <m-button>Menu</m-button>
        </magic-menu-trigger>
        <magic-menu-content :arrow="false">
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item class="w-full">New Tab</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">New Window</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">New Private Window</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item class="w-full"> More Tools </m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item class="w-full">Bookmark Manager</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">History</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item class="w-full">Downloads</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Show Bookmarks</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Show Full URLs</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Christoph Jeworutzki</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Robin Scholz</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--context"
      :options="{ mode: 'context' }"
      class="w-full"
    >
      <magic-menu-view>
        <magic-menu-trigger
          class="w-full h-36 border-2 border-dashed border-surface rounded-lg flex items-center justify-center"
        >
          <span class="type-control-text-sm text-surface-subtle">
            Right click
          </span>
        </magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item class="w-full">Item 1</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Item 2</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item class="w-full">Item 3</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--navigation"
      :options="{ mode: 'navigation' }"
      class="mx-auto"
    >
      <magic-menu-view>
        <magic-menu-trigger
          class="flex bg-gray rounded-2xl bg-surface-elevation-base"
        >
          <magic-menu-remote channel-id="a">
            <m-button mode="ghost"> Home </m-button>
          </magic-menu-remote>
          <magic-menu-remote channel-id="b">
            <m-button mode="ghost">Events</m-button>
          </magic-menu-remote>
          <magic-menu-remote channel-id="c">
            <m-button mode="ghost">Projects</m-button>
          </magic-menu-remote>
          <magic-menu-remote channel-id="d">
            <m-button mode="ghost">FAQ</m-button>
          </magic-menu-remote>
        </magic-menu-trigger>
        <magic-menu-content>
          <div class="p-1">
            <magic-auto-size class="bg-surface-elevation-base rounded-2xl">
              <magic-menu-channel id="a" class="w-[40rem] h-[20rem]">
                Home Channel
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
  </div>
</template>

<script lang="ts" setup>
import { MMenuItem, MButton } from '@maas/mirror/vue'

import { onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'
import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  // console.log(id, payload)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})

function onEnter() {
  console.log('enter')
}
</script>

<style>
.menu-enter-active {
  animation: fadeIn 0.3s ease;
}

.menu-leave-active {
  position: absolute;
  animation: fadeOut 0.3s ease;
}
</style>
