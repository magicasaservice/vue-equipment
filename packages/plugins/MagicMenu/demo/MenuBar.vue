<template>
  <magic-menu-bar class="w-full flex items-center gap-4 p-4 bg-brown">
    <magic-menu-bar-item>
      <span>File</span>
      <file-view />
    </magic-menu-bar-item>
    <magic-menu-bar-item>
      <span>Edit</span>
      <edit-view />
    </magic-menu-bar-item>
    <magic-menu-bar-item>
      <span>View</span>
      <view-view />
    </magic-menu-bar-item>
    <magic-menu-bar-item>
      <span>Profiles</span>
      <profiles-view />
    </magic-menu-bar-item>
  </magic-menu-bar>
</template>

<script lang="ts" setup>
import FileView from './FileView.vue'
import EditView from './EditView.vue'
import ViewView from './ViewView.vue'
import ProfilesView from './ProfilesView.vue'
</script>

<style>
.magic-menu-bar-item.-active {
  background: blue;
}

.magic-menu-item.-active {
  background: yellow;
  color: black;
}

.magic-menu-float {
  /* background: green;
  position: fixed;
  top: 0; */
  z-index: 999;
}

.magic-menu-view {
  width: 200px;
  background: purple;
}
</style>
