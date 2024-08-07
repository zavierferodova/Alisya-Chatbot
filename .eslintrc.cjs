/* eslint-env node */
module.exports = {
    root: true,
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            plugins: ['@typescript-eslint'],
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: './tsconfig.json'
            },
            rules: {
                "@typescript-eslint/semi": ["error", "never"]
            }
        },
        {
            files: ['*.js'],
            extends: "standard",
            rules: {}
        }
    ]
};
