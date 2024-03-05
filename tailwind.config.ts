import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import { fontFamily } from 'tailwindcss/defaultTheme'
import type { PluginAPI } from 'tailwindcss/types/config'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [['Uncut Sans', ...fontFamily.sans], { fontFeatureSettings: '"tnum"' }],
      },
      colors: {
        gray: {
          ...colors.zinc,
          950: '#131316',
        },
      },
    },
    keyframes: {
      fadeIn: {
        from: { opacity: '0' },
        to: { opacity: '1' },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    function ({ addVariant }: PluginAPI) {
      addVariant('standalone', '@media all and (display-mode: standalone)')
    },
  ],
} satisfies Config
