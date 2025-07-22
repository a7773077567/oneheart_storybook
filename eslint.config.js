// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
  },
  // For CSS Formatting with Plugin
  formatters: {
    css: true,
  },

}, {
  rules: {
    'prefer-const': 'off',
    'no-console': 'warn',
    'curly': 'off',
    'no-else-return': ['error', { allowElseIf: false }],
    'array-element-newline': ['error', 'consistent'],
    'import/order': 'off',

    // Vue Related
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: false },
    ],
    'vue/singleline-html-element-content-newline': 'off',

    // Eslint-Plugin-Eslint-Comment
    'eslint-comments/no-unlimited-disable': 'off',
  },
});
