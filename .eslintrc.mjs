module.exports = {
  root: true,
  
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.mjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'react'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'no-mixed-spaces-and-tabs': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    'react/jsx-first-prop-new-line': [2, 'multiline-multiprop'],
    'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-max-props-per-line': [2, { maximum: 1, when: 'always' }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
