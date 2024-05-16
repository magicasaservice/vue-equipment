<template>
  <magic-menu-view id="edit-view">
    <magic-menu-item>
      <span>Undo</span>
    </magic-menu-item>
    <magic-menu-item>
      <span>Redo</span>
    </magic-menu-item>
    <magic-menu-item id="find-item">
      <span>Find ></span>
      <edit-find-view />
    </magic-menu-item>
    <magic-menu-item>
      <span>Cut</span>
    </magic-menu-item>
    <magic-menu-item>
      <span>Copy</span>
    </magic-menu-item>
    <magic-menu-item>
      <span>Paste</span>
    </magic-menu-item>
  </magic-menu-view>
</template>

<script lang="ts" setup>
import EditFindView from './EditFindView.vue'
</script>
