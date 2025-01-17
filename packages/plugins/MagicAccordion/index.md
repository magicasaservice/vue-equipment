# Magic Accordion

<component-preview src="./demo.vue"/>

## Usage

```vue
<template>
  <magic-accordion-provider id="id">
    <magic-accordion-view>
      <magic-accordion-trigger>Card Tricks</magic-accordion-trigger>
      <magic-accordion-content>
        <div class="w-[20rem]">
          Card tricks captivate audiences with sleight of hand, misdirection,
          and clever psychology, creating illusions that make the impossible
          seem real.
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
    <magic-accordion-view>
      <magic-accordion-trigger>Illusions</magic-accordion-trigger>
      <magic-accordion-content>
        <div class="w-[20rem]">
          Illusions in magic rely on optical tricks and hidden mechanisms,
          making spectators question reality and marvel at the magician’s
          seemingly supernatural skills.
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
    <magic-accordion-view>
      <magic-accordion-trigger>Escapes</magic-accordion-trigger>
      <magic-accordion-content>
        <div class="w-[20rem]">
          Escape artists perform daring feats of escape from handcuffs, chains,
          and other restraints, thrilling audiences with their death-defying
          stunts.
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
  </magic-accordion-provider>
</template>
```
