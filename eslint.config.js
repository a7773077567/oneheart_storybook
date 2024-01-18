import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
  },
  formatters: {
    css: true,
  },
}, {
  rules: {
    'no-console': 'warn',
    'curly': 'off',
    'no-else-return': ['error', { allowElseIf: false }],
    // Vue Related
    // 'vue/component-name-in-template-casing': [
    //   'error',
    //   'PascalCase',
    //   { registeredComponentsOnly: false },
    // ],
  },
});
