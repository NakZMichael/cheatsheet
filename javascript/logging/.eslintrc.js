module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'object-curly-spacing':[
      'error',
      'always'
    ],
    'arrow-spacing':[
      'error',
      { 'before': true, 'after': true }
    ],
    'no-buffer-constructor':'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'comma-spacing': ['error', { 'before': false, 'after': true }]
  }
};
