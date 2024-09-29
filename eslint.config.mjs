import antfu from '@antfu/eslint-config';

export default antfu({
  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/dist/**',
    '**/docs/**',
    '**/dist-user/**',
    '**/node_modules/**',
    '**/public/**',
    'eslint.config.js',
    '.eslintrc.js',
    '**/fixtures',
    // ...globs
  ],
}, {
  rules: {
    'curly': 'off',
    'no-console': 'warn',
    'semi': ['error', 'always'],
    'ts/consistent-type-definitions': 'off',
    'vue/block-order': 'off',
    'ts/ban-ts-comment': 'warn',
    'style/semi': 'off',
    'ts/no-require-imports': 'off',
    'node/prefer-global/process': 'off',
    'no-restricted-properties': 'off',
    'no-alert': 'off',
    'vue/custom-event-name-casing': 'off',
  },
});
