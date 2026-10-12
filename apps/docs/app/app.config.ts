import { version } from '../../../package.json'

export default defineAppConfig({
  appTitle: 'Vue Equipment',
  appTitleSuffix: 'Vue Equipment',
  appDescription: 'Our Frontend Toolkit, Free and Open Source.',
  // Social cards need absolute URLs, so the deployed origin is spelled out
  appUrl: 'https://vue.equipment',
  appImageAlt:
    'A v-shaped triangle carabiner with engraved small text on one side',
  appVersion: version,
  repositoryUrl: 'https://github.com/magicasaservice/vue-equipment',
  moreLinks: [
    { label: 'Magic as a Service™', href: 'https://maas.engineering' },
    { label: 'Legal Notice', href: 'https://maas.engineering/legal-notice' },
    {
      label: 'Privacy Policy',
      href: 'https://maas.engineering/privacy-policy',
    },
    { label: 'GitHub', href: 'https://github.com/magicasaservice' },
  ] as Array<{ label: string; href: string }>,
})
