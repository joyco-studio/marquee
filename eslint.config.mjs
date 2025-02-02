import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default tseslint.config([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['dist', '**/.*'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-compiler': reactCompiler,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
])
