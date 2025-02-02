import { defineConfig } from 'tsup'

export default defineConfig([
  /* Default core entrypoint - Add your own entrypoints here */
  {
    entry: ['packages/core/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: true,
  },
])
