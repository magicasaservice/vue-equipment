<template>
  <div class="w-full max-w-screen flex flex-col gap-24 items-center">
    <magic-menu-provider
      id="magic-menu--menubar"
      :options="{ debug: true }"
      class="flex gap-2 rounded-2xl bg-surface-elevation-base"
    >
      <magic-menu-view>
        <magic-menu-trigger class="m-button -ghost">Edit</magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item>Undo</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Redo </m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item> Find </m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item>Search the web…</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Find…</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Find Next</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Find Previous</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Cut</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Copy</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Paste</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="m-button -ghost">File</magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item>New Tab</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>New Window</m-menu-item>
            </magic-menu-item>
            <magic-menu-item :disabled="true">
              <m-menu-item> New Incognito Window </m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item>Share</m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item :disabled="true">
                      <m-menu-item :disabled="true"> Email Link </m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Messages</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Notes</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <magic-menu-view>
                        <magic-menu-trigger>
                          <m-menu-item>Socials</m-menu-item>
                        </magic-menu-trigger>
                        <magic-menu-content>
                          <div
                            class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                          >
                            <magic-menu-item>
                              <m-menu-item> Instagram </m-menu-item>
                            </magic-menu-item>
                            <magic-menu-item>
                              <m-menu-item> Threads </m-menu-item>
                            </magic-menu-item>
                            <magic-menu-item>
                              <m-menu-item> Twitter </m-menu-item>
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
              <m-menu-item>Print</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="m-button -ghost">View</magic-menu-trigger>
        <magic-menu-content>
          <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
            <magic-menu-item>
              <m-menu-item>Show Bookmarks</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Show Full URLs</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Reload</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Force Reload</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>ToggleFullscreen</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Hide Sidebar</m-menu-item>
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
                  <m-menu-item>Christoph Jeworutzki</m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item>User Settings</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Edit Profile</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Subscribtions</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <magic-menu-view>
                <magic-menu-trigger>
                  <m-menu-item> Robin Scholz</m-menu-item>
                </magic-menu-trigger>
                <magic-menu-content>
                  <div
                    class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]"
                  >
                    <magic-menu-item>
                      <m-menu-item>User Settings</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Edit Profile</m-menu-item>
                    </magic-menu-item>
                    <magic-menu-item>
                      <m-menu-item>Subscribtions</m-menu-item>
                    </magic-menu-item>
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Edit…</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Add Profile…</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--dropdown"
      :options="{ mode: 'dropdown' }"
    >
      <magic-menu-view id="dropdown-view" class="flex justify-center">
        <magic-menu-trigger>
          <m-button>Menu</m-button>
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
              <m-menu-item>Item 1</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Item 2</m-menu-item>
            </magic-menu-item>
            <magic-menu-item>
              <m-menu-item>Item 3</m-menu-item>
            </magic-menu-item>
          </div>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--navigation"
      :options="{ mode: 'navigation', debug: true }"
      class="mx-auto"
    >
      <magic-menu-view>
        <div
          ref="navigationRef"
          class="w-full flex bg-gray rounded-2xl bg-surface-elevation-base"
        >
          <magic-menu-trigger as-child>
            <magic-menu-remote channel-id="a" as-child>
              <m-button mode="ghost"> Home </m-button>
            </magic-menu-remote>
          </magic-menu-trigger>

          <magic-menu-trigger as-child>
            <magic-menu-remote channel-id="b" as-child>
              <m-button mode="ghost">Events</m-button>
            </magic-menu-remote>
          </magic-menu-trigger>

          <magic-menu-trigger as-child>
            <magic-menu-remote channel-id="c" as-child>
              <m-button mode="ghost">Projects</m-button>
            </magic-menu-remote>
          </magic-menu-trigger>

          <m-button mode="ghost">External Link</m-button>

          <magic-menu-trigger as-child>
            <magic-menu-remote channel-id="d" as-child>
              <m-button mode="ghost">FAQ</m-button>
            </magic-menu-remote>
          </magic-menu-trigger>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { MMenuItem, MMenuCard, MMenuCardChild, MButton } from '@maas/mirror/vue'
import type { ValueOf } from '@maas/vue-equipment/utils'
import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})

const navigationRef = ref<HTMLElement | null>(null)
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
