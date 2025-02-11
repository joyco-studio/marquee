import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: './server/app.ts',
        }
      : undefined,
  },
  ssr: {
    // add here libraries such as basehub, tempus, lenis
    noExternal: command === 'build' ? true : ['gsap'],
  },
  server: {
    port: 3000,
  },
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
}))
