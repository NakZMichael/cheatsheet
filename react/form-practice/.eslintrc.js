module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    semi: [2, 'always'],
    quotes: [2, 'single'],
    'import/no-unresolved': 0,
    'import/extensions': [2, { extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'] }],
    'no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': ['off'],
    'react/function-component-definition': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
  },
  settings: {
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
