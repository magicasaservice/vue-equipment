<template>
  <magic-draggable
    id="demo-draggable"
    :options="{
      snapPoints: [
        'top-left',
        // 'top-center',
        'top-right',
        // 'center-left',
        // 'center',
        // 'center-right',
        'bottom-left',
        // 'bottom-center',
        'bottom-right',
      ],
      initial: {
        snapPoint: 'top-left',
      },
    }"
  >
    <div class="bg-white aspect-square w-40 rounded-md" />
  </magic-draggable>
</template>
