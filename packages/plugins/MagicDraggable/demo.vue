<template>
  <div>
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
      <div class="bg-[blue] aspect-square w-40 rounded-md" />
    </magic-draggable>
    <magic-draggable
      id="demo-contained-draggable"
      :options="{
        snapPoints: [
          'top-center',
          'center-left',
          'center-right',
          'bottom-center',
        ],
        initial: { snapPoint: 'top-center' },
      }"
      class="border-solid border-2 border-gray-500 aspect-square"
    >
      <div class="bg-[yellow] aspect-square w-20 rounded-full" />
    </magic-draggable>
  </div>
</template>

<style>
#demo-contained-draggable {
  --magic-draggable-position: relative;
}
</style>
