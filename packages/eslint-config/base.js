import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      import: importPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
      'max-lines': [
        'error',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ['dist/**', '.turbo/**', 'node_modules/**', '.next/**'],
  },
]
