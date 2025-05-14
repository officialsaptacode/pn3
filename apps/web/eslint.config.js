import { nextJsConfig } from '@workspace/eslint-config/next-js'

export default [
  ...nextJsConfig,
  {
    // Project-specific overrides
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
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
]
