<template>
  <magic-menu-provider
    id="magic-menu-menubar"
    class="inline-flex gap-2 rounded-2xl bg-surface-elevation-base"
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
</template>

<script lang="ts" setup>
import { MMenuItem, MButton } from '@maas/mirror/vue'
import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'
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
