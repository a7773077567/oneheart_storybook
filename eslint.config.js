import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
  },
  formatters: {
    css: true,
  },
  // typescript: {
  //   overrides: {
  //     'ts/consistent-type-definitions': 'off',
  //   },
  // },
}, {
  rules: {
    'prefer-const': 'off',
    'no-console': 'warn',
    'curly': 'off',
    'no-else-return': ['error', { allowElseIf: false }],
    'array-element-newline': ['error', 'consistent'],

    // Vue Related
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: false },
    ],

  },
});
