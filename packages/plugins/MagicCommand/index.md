# Magic Command

Magic Menu is a flexible collection of components intended to build command palette style menus, such as Spotlight, Raycast and the like.

<component-preview src="./demo/ModalDemo.vue"/>

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-command-provider id="your-command-id">
    <!-- optional -->
    <magic-command-trigger view-id="your-view-id">
      Open Menu
    </magic-command-trigger>

    <!-- modal -->
    <magic-command-modal>
      <magic-command-renderer />
    </magic-command-modal>

    <!-- drawer -->
    <magic-command-drawer>
      <magic-command-renderer />
    </magic-command-drawer>

    <!-- initial view -->
    <magic-command-view :initial="true" id="your-view-id">
      <magic-command-content>
        <magic-command-item>
          <!-- your content -->
        </magic-command-item>

        <!-- nested view -->
        <magic-command-item>
          <magic-command-view>
            <magic-command-trigger>Open View</magic-command-trigger>
            <magic-command-content>
              <!-- your content -->
            </magic-command-content>
          </magic-command-view>
        </magic-command-item>
      </magic-command-content>
    </magic-command-view>
  </magic-command-provider>
</template>
```
