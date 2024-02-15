import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import { fontFamily } from 'tailwindcss/defaultTheme'

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
  plugins: [],
} satisfies Config
