import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: './server/app.ts',
        }
      : undefined,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  ssr: {
    // add here libraries such as basehub, tempus, lenis
    noExternal: command === 'build' ? true : ['gsap'],
  },
  server: {
    port: 3000,
  },
  plugins: [reactRouter(), tsconfigPaths()],
}))
