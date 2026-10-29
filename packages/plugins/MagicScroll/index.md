# MagicScroll

MagicScroll is a flexible collection of components intended to build various types of scroll-based animations and alerts.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Vue

If you are using Vue, import and add `MagicScrollPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicScrollPlugin } from '@maas/vue-equipment/plugins/MagicScroll'

const app = createApp({})

app.use(MagicScrollPlugin)
```

### Nuxt

The components are available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicScroll` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicScroll'],
  },
})
```

## Peer Dependencies

MagicScroll relies on the following optional peer dependencies in addition to the [core peer dependencies](/overview/getting-started#core). Package managers don’t install optional peer dependencies automatically, so add them to your project.

::docs-table
---
columns:
  - label: Package
rows:
  - items:
      - label: '[motion](https://www.npmjs.com/package/motion)'
---
::

### Installation

::package-install{name="motion"}
::

## API Reference

### MagicScrollProvider

The MagicScrollProvider calculates the scroll distance for either the window or the given target and passes it down to its children.

#### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: target
        description: Providing a target is optional. Can either be an element ref, a HTML element or a Vue component.
      - label: MaybeElementRef<HTMLElement | null>
        description: More info can be found in the [VueUse docs](https://vueuse.org/core/unrefElement/#type-declarations).
        escape: true
      - label: 'false'
---
::

### MagicScrollScene

The MagicScrollScene calculates the scroll progress based on the automatically injected scroll distance and the passed props.

For example `from="top-bottom" to="bottom-top"` would calculate the progress from where the top edge of the element reaches the bottom edge of the target until where the bottom edge of the element reaches the top edge of the target.

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: from
        description: Provide an intersection, from which the progress is calculated.
      - label: ScrollIntersection
        description: "'top-top' | 'top-center' | 'top-bottom' | 'center-top' | 'center-center' | 'center-bottom' | 'bottom-top' | 'bottom-center' | 'bottom-bottom'"
      - label: 'false'
  - items:
      - label: to
        description: Provide an intersection, to which the progress is calculated.
      - label: ScrollIntersection
        description: "'top-top' | 'top-center' | 'top-bottom' | 'center-top' | 'center-center' | 'center-bottom' | 'bottom-top' | 'bottom-center' | 'bottom-bottom'"
      - label: 'false'
---
::

#### Data Attributes

::docs-table
---
columns:
  - label: Attribute
  - label: Description
rows:
  - items:
      - label: data-progress
      - plaintext: true
        label: Reflects the current scroll progress, calculated from the passed intersections.
---
::

### MagicScrollMotion

MagicScrollMotion is a wrapper around [motion.dev](https://motion.dev/) for scroll based animations.

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: sequence
        description: A modified motion.dev [timeline sequence](https://motion.dev/docs/animate#timeline-sequences), where the initial element is omitted for each entry.
      - label: MagicScrollSequence
        description: MagicScrollSequence is derived directly from motion’s `AnimationSequence`. It omits the initial element entry of the array. More info can be found in the [motion.dev docs](https://motion.dev/docs/animate#timeline-sequences).
      - label: 'true'
  - items:
      - label: sequenceOptions
        description: Set options for the entire sequence.
      - label: SequenceOptions
        description: More info can be found in the [motion.dev docs](https://motion.dev/docs/animate#timeline-sequences).
      - label: 'false'
  - items:
      - label: progress
        description: Override the injected progress.
      - label: number
      - label: 'false'
---
::

#### Data Attributes

::docs-table
---
columns:
  - label: Attribute
  - label: Description
rows:
  - items:
      - label: data-progress
      - plaintext: true
        label: Reflects the current progress, either the injected scroll progress or the overriding `progress` prop.
---
::

### MagicScrollCollision

MagicScrollCollision emits an event once the element’s top or bottom edge collides with the target’s top or bottom edge.

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: id
        description: Providing an id is optional. The id is passed to the emitter and can be used to filter emitted events.
      - label: string
      - label: 'false'
  - items:
      - label: offset
        description: Offset the collision locations.
      - label: CollisionOffset
        description: '{ top: number, bottom: number }'
      - label: 'false'
---
::

## Errors

::docs-table
---
columns:
  - label: Source
  - label: Error Code
  - label: Message
rows:
  - items:
      - label: MagicScrollScene
      - label: missing_scroll_target
      - plaintext: true
        label: MagicScrollScene must be used within a MagicScrollProvider
  - items:
      - label: MagicScrollCollision
      - label: missing_scroll_target
      - plaintext: true
        label: MagicScrollCollision must be used within a MagicScrollProvider
---
::

## Examples

### Collision Detection

::component-preview{src="./demo/CollisionDetectionDemo.vue"}
::
