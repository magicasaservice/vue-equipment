import { version } from '../../../package.json'

export default defineAppConfig({
  docs: {
    title: 'Vue Equipment',
    description: 'Our Frontend Toolkit, Free and Open Source.',
    url: 'https://vue.equipment',
    version,
    repository: 'https://github.com/magicasaservice/vue-equipment',
    image: {
      src: '/images/og-image.jpg',
      alt: 'A v-shaped triangle carabiner with engraved small text on one side',
    },
  },
})
