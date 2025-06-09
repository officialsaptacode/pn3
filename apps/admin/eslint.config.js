import { config } from '@workspace/eslint-config/react-internal'

export default [
  ...config,
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
