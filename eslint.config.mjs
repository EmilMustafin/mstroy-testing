import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginVitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import gitignore from 'eslint-config-flat-gitignore';
// eslint-disable-next-line import/no-extraneous-dependencies
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginImport from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default defineConfig(
    {
        extends: [
            gitignore(),
            js.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            pluginImport.flatConfigs.recommended,
            ...pluginVue.configs['flat/recommended'],
            eslintConfigPrettier,
        ],
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
    },
    {
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.app.json',
                extraFileExtensions: ['.vue'],
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            vue: pluginVue,
            vitest: pluginVitest,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            'arrow-body-style': 'off',
            'prefer-arrow-callback': 'off',
            'no-console': 'error',
            'no-debugger': 'error',
            // Vue Rules
            'vue/no-ref-object-reactivity-loss': 'error',
            'vue/padding-line-between-blocks': 'error',
            'vue/block-lang': ['error', { script: { lang: 'ts' } }],
            'vue/no-undef-components': [
                'error',
                {
                    ignorePatterns: ['custom(\\-\\w+)+', 'RouterView'],
                },
            ],
            'vue/define-macros-order': [
                'error',
                { defineExposeLast: true, order: ['defineProps', 'defineEmits', 'defineModel'] },
            ],
            'vue/v-for-delimiter-style': 'error',
            'vue/no-undef-properties': [
                'error',
                {
                    ignores: ['/^\\$/'],
                },
            ],
            'vue/prefer-true-attribute-shorthand': 'error',
            'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
            'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: true }],
            'vue/no-irregular-whitespace': 'error',
            'vue/no-dupe-keys': 'error',
            // Import Rules
            'import/export': 'error',
            'import/no-unresolved': 'off',
            'import/no-deprecated': 'error',
            'import/no-empty-named-blocks': 'error',
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [
                        '**/*.test.{ts,tsx,js,jsx}',
                        '**/*.spec.{ts,tsx,js,jsx}',
                        '**/test/**',
                        '**/tests/**',
                        '**/__tests__/**',
                        '*.config.{ts,js,mjs,cjs}',
                        '**/*.config.{ts,js,mjs,cjs}',
                        '**/vite.config.{ts,js}',
                        '**/vitest.config.{ts,js}',
                        '**/eslint.config.{ts,js}',
                    ],
                },
            ],
            'import/no-mutable-exports': 'error',
            'import/no-unused-modules': 'error',
            'import/no-named-as-default': 'error',
            'import/no-named-as-default-member': 'error',
            'import/no-amd': 'error',
            'import/no-commonjs': 'error',
            'import/no-import-module-exports': 'error',
            'import/no-nodejs-modules': 'off',
            'import/unambiguous': 'off',
            'import/default': 'error',
            'import/named': 'error',
            'import/namespace': 'error',
            'import/no-absolute-path': 'error',
            'import/no-cycle': 'error',
            'import/no-dynamic-require': 'error',
            'import/no-internal-modules': 'off',
            'import/no-relative-packages': 'error',
            'import/no-self-import': 'error',
            'import/no-useless-path-segments': 'error',
            'import/no-webpack-loader-syntax': 'error',
            'import/consistent-type-specifier-style': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'import/no-named-default': 'error',
            'import/no-namespace': 'error',
            'import/no-unassigned-import': [
                'error',
                {
                    allow: ['**/*.css', '**/*.scss', '**/*.less', '**/*.sass'],
                },
            ],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'never',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    distinctGroup: true,
                },
            ],
        },
    },
    {
        files: ['**/*.js', '*.config.ts', '*.config.mjs'],
        extends: [tseslint.configs.disableTypeChecked],
    },
    {
        files: ['src/**/__tests__/**/*.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
        extends: [tseslint.configs.disableTypeChecked],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: null,
            },
        },
        ...pluginVitest.configs.recommended,
    },
);
