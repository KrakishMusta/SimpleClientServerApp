// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
    // Базовые рекомендуемые правила ESLint
    eslint.configs.recommended,

    // Рекомендуемые правила TypeScript
    ...tseslint.configs.recommended,

    // Настройки для TypeScript файлов
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
            },
        },
        rules: {
            semi: ['error', 'always'],
            '@typescript-eslint/no-unused-vars': 'warn',
            // Дополнительные правила по вашему выбору
        },
    },

    // Игнорировать определенные файлы/папки
    {
        ignores: ['**/node_modules/', '**/dist/', '**/build/', '**/*.js'],
    },
);
