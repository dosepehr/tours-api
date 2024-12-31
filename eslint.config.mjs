import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            env: {
                node: true, // Enables Node.js environment
            },
        },
        rules: {
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^next$|^res$|^req$|^err$',
                },
            ],
        },
    },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
];
