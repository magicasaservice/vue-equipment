<template>
  <magic-menu-view id="file-view">
    <magic-menu-item>New Tab</magic-menu-item>
    <magic-menu-item>New Window</magic-menu-item>
    <magic-menu-item>New Incognito Window</magic-menu-item>
    <magic-menu-item>
      <span>Share ></span>
      <file-share-view />
    </magic-menu-item>

    <magic-menu-item>Print</magic-menu-item>
  </magic-menu-view>
</template>

<script lang="ts" setup>
import FileShareView from './FileShareView.vue'
</script>
