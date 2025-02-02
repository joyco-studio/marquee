import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { core: 'packages/core/index.ts', react: 'packages/react/index.tsx' },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: true,
    external: ['react', '@joycostudio/marquee'],
  },
])
