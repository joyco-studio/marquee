/** @type {import('tailwindcss').Config} */
import toemPlugin from 'toem-tailwind-plugin'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      fontFamily: {
        sans: [
          'Barlow Condensed',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        mono: [
          'Roboto Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
          background: '#ffffff',
        },
        secondary: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
          background: '#000000',
        },
        background: '#0344dc',
        foreground: '#ffffff',
        muted: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [
    toemPlugin({
      /* Optional */
      defaultBase: 16 /* Default value is: 16 */,
      autoBase: true,
    }),
  ],
}
