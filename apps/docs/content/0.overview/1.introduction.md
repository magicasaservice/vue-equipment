---
next:
  text: 'Getting Started'
  link: '/overview/getting-started/'
---

# Introduction

### Our Frontend Toolkit, Free and Open Source

Vue Equipment is a collection of ready-to-use plugins and composables for building modern web applications. It comes unstyled, with a flexible, yet opinionated API. It’s fully typed and can be integrated in both Vue and Nuxt.

## Vision

Over the years, we have found ourselves facing a common problem: driven by the lack of options in the Vue ecosystem, we needed to implement solutions from the ground-up, over and over again. Vue Equipment is our attempt to solve this.

While projects like [VueUse](https://vueuse.org/) and various [Nuxt modules](https://nuxt.com/modules) have recently closed the gap to the once superior React ecosystem, we feel that there is still some catching up to do.

## Architecture

Vue Equipment does not aim to be a component library, but instead aims to help reduce the complexities of building web applications.

- Vue Equipment is largely unstyled. Any CSS we ship is crucial for the functionality. Relevant values are available as CSS variables and can be overriden.
- Most options are grouped under the `option` prop of the outermost component. We believe this leads to cleaner templates and a better developer experience as opposed to having multiple props which need to be repeated for each nested component.
- Selected options can be overriden directly through props on nested components.
- Each plugin comes with a composable to interact with the components.
- We expose internally used injection keys, in case you’d like to replace certain components with custom solutions.
- Relevant types and interfaces are exposed.
- State is exposed to components through data attributes.
- We recommend using [Enums](https://www.typescriptlang.org/docs/handbook/enums.html) for Ids to ensure consistency when using Vue Equipment.

## Inspiration

Even though we mostly work with Vue, we’ve kept an eye on the React ecosystem and have been massively inspired by projects such as [Sonner](https://github.com/emilkowalski/sonner); [Vaul](https://github.com/emilkowalski/vaul); [⌘K](https://github.com/pacocoursey/cmdk); [Radix](https://github.com/radix-ui/primitives); [shadcn/ui](https://github.com/shadcn-ui/ui), and the likes. With Vue Equipment, we hope to finally give back something to the community that has enabled us to earn a living for the past decade.

## Contribution

Please don’t hesitate to reach out should you have an idea for another plugin or would like to contribute in some other way. We think that the intial version of Vue Equipment already provides some value, but would like to expand it further in the future.
