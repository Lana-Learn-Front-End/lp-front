module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-shadow': [
      'error',
      {
        'allow': ['Vue'] //for Vue plugin development
      }
    ],
    'prefer-destructuring': 'warn',
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'class-methods-use-this': 'off',
    'object-curly-newline': [
      'warn',
      {
        'ImportDeclaration': {
          'multiline': true,
          'minProperties': 8
        }
      }
    ],
    'lines-between-class-members': 'off',
    'max-len': ['warn', 120],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'import/no-named-default': 'off',
    'import/prefer-default-export': 'warn'
  },
};
