<template>
  <magic-draggable id="magic-draggable-demo" class="bg-surface-base rounded-md">
    <div
      class="bg-surface-high flex aspect-square w-32 items-center justify-center rounded-md"
    >
      <m-badge>Drag me</m-badge>
    </div>
  </magic-draggable>
</template>

<style>
[data-id='magic-draggable-demo'] {
  --magic-draggable-position: relative;
  --magic-draggable-z-index: 50;
  --magic-draggable-height: 20rem;
}
</style>
