<template>
  <component :is="icons[name]" class="base-icon" />
</template>

<script lang="ts" setup>
import ArrowE from '~icons/maas/arrow-e500'
import ArrowW from '~icons/maas/arrow-w500'
import BrandGithub from '~icons/maas/brand-github500'
import Carabiner from '~icons/maas/carabiner500'
import Check from '~icons/maas/check500'
import CheckOval from '~icons/maas/check-oval500'
import ChevronS from '~icons/maas/chevron-s500'
import Close from '~icons/maas/close500'
import CopyClipboard from '~icons/maas/copy-clipboard500'
import Document from '~icons/maas/document500'
import Link from '~icons/maas/link500'
import MaasRobot from '~icons/maas/maas-robot500'
import Magnifier from '~icons/maas/magnifier500'
import Md from '~icons/maas/md500'
import Menu from '~icons/maas/menu500'
import Moon from '~icons/maas/moon500'
import SignInfoOval from '~icons/maas/sign-info-oval500'
import SignWarningOval from '~icons/maas/sign-warning-oval500'
import Sun from '~icons/maas/sun500'

// Every symbol the shell draws is compiled in at build time, so a name has
// to be listed here before it can be used.
const icons = {
  'arrow-e': ArrowE,
  'arrow-w': ArrowW,
  'brand-github': BrandGithub,
  carabiner: Carabiner,
  check: Check,
  'check-oval': CheckOval,
  'chevron-s': ChevronS,
  close: Close,
  'copy-clipboard': CopyClipboard,
  document: Document,
  link: Link,
  'maas-robot': MaasRobot,
  magnifier: Magnifier,
  md: Md,
  menu: Menu,
  moon: Moon,
  'sign-info-oval': SignInfoOval,
  'sign-warning-oval': SignWarningOval,
  sun: Sun,
}

interface BaseIconProps {
  name: keyof typeof icons
}

const { name } = defineProps<BaseIconProps>()
</script>
