<template>
  <div class="w-full flex flex-col gap-24 items-center">
    <magic-menu-provider id="magic-menu--menubar" class="flex">
      <magic-menu-view>
        <magic-menu-trigger class="px-4">Edit</magic-menu-trigger>
        <magic-menu-content>
          <magic-menu-item>Undo</magic-menu-item>
          <magic-menu-item>Redo</magic-menu-item>
          <magic-menu-item id="test">
            <magic-menu-view>
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

    <magic-menu-provider id="magic-menu--dropdown">
      <magic-menu-view class="flex justify-center">
        <magic-menu-trigger class="inline">Open</magic-menu-trigger>
        <magic-menu-content placement="bottom">
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
          <magic-menu-item>Show Bookmarksw</magic-menu-item>
          <magic-menu-item>Show Full URLs</magic-menu-item>
          <magic-menu-item>Christoph Jeworutzki</magic-menu-item>
          <magic-menu-item>Robin Scholz</magic-menu-item>
        </magic-menu-content>
      </magic-menu-view>
    </magic-menu-provider>
  </div>

  <!-- <magic-menu-provider id="magic-menu--dropdown">
    <magic-menu-view position="bottom">
      <magic-menu-trigger>ICON</magic-menu-trigger>
      <magic-menu-content>
        <magic-menu-item>Item 1</magic-menu-item>
        <magic-menu-item>Item 2</magic-menu-item>
        <magic-menu-item>Item 3</magic-menu-item>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>

  <magic-menu-provider id="magic-menu--context">
    <magic-menu-view>
      <magic-menu-trigger listener="rightClick"> ICON </magic-menu-trigger>
      <magic-menu-content>
        <magic-menu-item>Item 1</magic-menu-item>
        <magic-menu-item>Item 2</magic-menu-item>
        <magic-menu-item>Item 3</magic-menu-item>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider> -->
</template>

<style>
.magic-menu-trigger.-active {
  background-color: red;
}

.magic-menu-item.-active {
  background-color: blueviolet;
}

.magic-menu-item.-disabled {
  opacity: 0.5;
}

.magic-menu-content__inner {
  width: 200px;
  background: lightcoral;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
