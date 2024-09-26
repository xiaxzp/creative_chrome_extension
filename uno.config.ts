import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import presetWind from '@unocss/preset-wind';

export default defineConfig({
  // https://windicss.org/posts/v30.html#attributify-mode
  presets: [
    presetUno(),
    presetWind(),
    presetAttributify(),
    presetIcons(),
  ],
  // extract: {
  //   include: [resolve(__dirname, 'src/**/*.{vue,html}')],
  // },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    extend: {
      screens: {
        xs: '450px',
      },
    },
  },
});
