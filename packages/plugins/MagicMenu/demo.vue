<template>
  <div class="w-full max-w-screen flex flex-col gap-24 items-center">
    <magic-menu-provider id="magic-menu--menubar" class="flex">
      <magic-menu-view id="test">
        <magic-menu-trigger class="px-4">Edit</magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>Undo</magic-menu-item>
          <magic-menu-item>Redo</magic-menu-item>
          <magic-menu-item>
            <magic-menu-view id="nested">
              <magic-menu-trigger>Find ></magic-menu-trigger>
              <magic-menu-content>
                <magic-menu-item>Search the web…</magic-menu-item>
                <magic-menu-item>Find…</magic-menu-item>
                <magic-menu-item>Find Next</magic-menu-item>
                <magic-menu-item>Find Previous</magic-menu-item>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-item>
          <magic-menu-item>Cut</magic-menu-item>
          <magic-menu-item>Copy</magic-menu-item>
          <magic-menu-item>Paste</magic-menu-item>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="px-4">File</magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>New Tab</magic-menu-item>
          <magic-menu-item>New Window</magic-menu-item>
          <magic-menu-item :disabled="true">
            New Incognito Window
          </magic-menu-item>
          <magic-menu-item>
            <magic-menu-view>
              <magic-menu-trigger>Share ></magic-menu-trigger>
              <magic-menu-content>
                <magic-menu-item :disabled="true">Email Link</magic-menu-item>
                <magic-menu-item>Messages</magic-menu-item>
                <magic-menu-item>Notes</magic-menu-item>
                <magic-menu-item>
                  <magic-menu-view>
                    <magic-menu-trigger>Socials ></magic-menu-trigger>
                    <magic-menu-content>
                      <magic-menu-item>Instagram</magic-menu-item>
                      <magic-menu-item>Threads</magic-menu-item>
                      <magic-menu-item>Twitter</magic-menu-item>
                    </magic-menu-content>
                  </magic-menu-view>
                </magic-menu-item>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-item>
          <magic-menu-item>Print</magic-menu-item>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="px-4">View</magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>Show Bookmarks</magic-menu-item>
          <magic-menu-item>Show Full URLs</magic-menu-item>
          <magic-menu-item>Reload</magic-menu-item>
          <magic-menu-item>Force Reload</magic-menu-item>
          <magic-menu-item>ToggleFullscreen</magic-menu-item>
          <magic-menu-item>Hide Sidebar</magic-menu-item>
        </magic-menu-content>
      </magic-menu-view>

      <magic-menu-view>
        <magic-menu-trigger class="px-4">Profiles</magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>
            <magic-menu-view>
              <magic-menu-trigger>Christoph Jeworutzki ></magic-menu-trigger>
              <magic-menu-content>
                <magic-menu-item>User Settings</magic-menu-item>
                <magic-menu-item>Edit Profile</magic-menu-item>
                <magic-menu-item>Subscribtions</magic-menu-item>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-item>
          <magic-menu-item :disabled="true">
            <magic-menu-view>
              <magic-menu-trigger>Robin Scholz ></magic-menu-trigger>
              <magic-menu-content>
                <magic-menu-item>User Settings</magic-menu-item>
                <magic-menu-item>Edit Profile</magic-menu-item>
                <magic-menu-item>Subscribtions</magic-menu-item>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-item>
          <magic-menu-item>Edit…</magic-menu-item>
          <magic-menu-item>Add Profile…</magic-menu-item>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--dropdown"
      :options="{ mode: 'dropdown' }"
    >
      <magic-menu-view class="flex justify-center" id="dropdown-view">
        <magic-menu-trigger
          class="inline w-16 h-16 rounded-full border-dashed flex items-center justify-center"
        >
          Menu
        </magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>New Tab</magic-menu-item>
          <magic-menu-item>New Window</magic-menu-item>
          <magic-menu-item>New Private Window</magic-menu-item>
          <magic-menu-item>
            <magic-menu-view>
              <magic-menu-trigger>More Tools ></magic-menu-trigger>
              <magic-menu-content>
                <magic-menu-item>Bookmark Manager</magic-menu-item>
                <magic-menu-item>History</magic-menu-item>
                <magic-menu-item>Downloads</magic-menu-item>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-item>
          <magic-menu-item>Show Bookmarks</magic-menu-item>
          <magic-menu-item>Show Full URLs</magic-menu-item>
          <magic-menu-item>Christoph Jeworutzki</magic-menu-item>
          <magic-menu-item>Robin Scholz</magic-menu-item>
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
          class="w-full h-36 border-dashed rounded-lg flex items-center justify-center"
        >
          Right click
        </magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>Item 1</magic-menu-item>
          <magic-menu-item>Item 2</magic-menu-item>
          <magic-menu-item>Item 3</magic-menu-item>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>

    <magic-menu-provider
      id="magic-menu--navigation"
      :options="{ mode: 'navigation' }"
      class="mx-auto"
    >
      <magic-menu-view>
        <magic-menu-trigger class="flex">
          <magic-menu-remote channel-id="a">Home</magic-menu-remote>
          <magic-menu-remote channel-id="b">Events</magic-menu-remote>
          <magic-menu-remote channel-id="c">Projects</magic-menu-remote>
          <magic-menu-remote channel-id="d">FAQ</magic-menu-remote>
        </magic-menu-trigger>
        <magic-menu-content>
          <magic-auto-size>
            <magic-menu-channel id="a" class="w-[20rem] h-[20rem]">
              Home Channel
            </magic-menu-channel>
            <magic-menu-channel id="b" class="w-[30rem] h-[20rem]">
              Events Channel
            </magic-menu-channel>
            <magic-menu-channel id="c" class="w-[40rem] h-[20rem]">
              Projects Channel
            </magic-menu-channel>
            <magic-menu-channel id="d" class="w-[50rem] h-[20rem]">
              FAQ Channel
            </magic-menu-channel>
          </magic-auto-size>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'

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
</script>

<style>
.magic-menu-trigger.-active {
  outline: solid 1px;
  outline-color: rgba(100, 200, 20);
}

.magic-menu-item {
  position: relative;
  height: 2.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.magic-menu-item .magic-menu-trigger {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

.magic-menu-item .magic-menu-view {
  height: 100%;
  width: 100%;
}

.magic-menu-item.-active {
  background-color: lightgrey;
}

.magic-menu-item.-disabled {
  opacity: 0.5;
}

.magic-menu-content__inner {
  min-width: 220px;
  background: white;
  color: black;
  display: flex;
  flex-direction: column;
}

.magic-menu-remote {
  padding: 0 1rem;
}

.magic-menu-remote.-active {
  outline: solid 1px;
  outline-color: red;
}
</style>
