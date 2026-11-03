# useTouchIntent

Tell a swipe from a scroll: a press that moves sideways is a swipe, one that moves up or down is a scroll. Useful wherever a scrollable element sits inside something that also reacts to a swipe, like a list inside a sidebar or a carousel inside a sheet.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```js
import { useTouchIntent } from '@maas/vue-equipment/composables/useTouchIntent'

const list = ref()

const { intent, isScrolling, isSwiping } = useTouchIntent({ target: list })
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Direct import

Import the composable directly where you need it.

```js
import { useTouchIntent } from '@maas/vue-equipment/composables/useTouchIntent'
```

## API Reference

### Options

::docs-table
---
columns:
  - label: Option
  - label: Type
  - label: Default
rows:
  - items:
      - label: target
        description: The element whose presses are watched. Defaults to the document.
      - label: MaybeRefOrGetter<Element | Document | null | undefined>
        escape: true
      - label: document
  - items:
      - label: axis
        description: The axis the target scrolls along. A move along it is a scroll and a move across it a swipe, so set `'x'` for a horizontal scroller like a carousel.
      - label: MaybeRefOrGetter<'x' | 'y'>
        escape: true
      - label: "'y'"
  - items:
      - label: threshold
        description: How far a press has to move, in pixels, before its intent is settled.
      - label: MaybeRefOrGetter<number>
        escape: true
      - label: '8'
---
::

### Returns

::docs-table
---
columns:
  - label: Name
  - label: Type
  - label: Description
rows:
  - items:
      - label: intent
      - label: Readonly<Ref<'scroll' | 'swipe' | undefined>>
        escape: true
      - label: What the current press turned out to be. `undefined` before the press has moved past `threshold` and again once it ends.
  - items:
      - label: isScrolling
      - label: ComputedRef<boolean>
        escape: true
      - label: Whether the current press is a scroll.
  - items:
      - label: isSwiping
      - label: ComputedRef<boolean>
        escape: true
      - label: Whether the current press is a swipe.
---
::

## Caveats

A press is judged once, by its first move past `threshold`: the larger of the two distances picks the intent, and the verdict holds until the pointer is released or cancelled. A swipe that drifts up or down after that stays a swipe, and a scroll that wanders sideways stays a scroll.

Presses are read in the capture phase, so `intent` is already up to date when the same move reaches listeners on the target or its children.
