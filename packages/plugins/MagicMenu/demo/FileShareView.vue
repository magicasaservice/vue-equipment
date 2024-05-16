<template>
  <magic-menu-view id="file-share-view">
    <magic-menu-item>Email Link</magic-menu-item>
    <magic-menu-item>Messages</magic-menu-item>
    <magic-menu-item>Notes</magic-menu-item>
    <magic-menu-item>
      <span>Socials</span>
      <file-share-socials-view />
    </magic-menu-item>
  </magic-menu-view>
</template>

<script lang="ts" setup>
import FileShareSocialsView from './FileShareSocialsView.vue'
</script>
