import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import cspellPlugin from '@cspell/eslint-plugin';
import jsx11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'dist',
			'node_modules/**/*',
			'dist/**/*',
			'coverage/**/*',
		],
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			ecmaVersion: 2024,
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2024,
			parser: tseslintParser,
			parserOptions: { tsconfigRootDir: __dirname },
		},
		plugins: {
			'@typescript-eslint': tseslintPlugin,
			unicorn,
			sonarjs,
			import: importPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			'jsx-a11y': jsx11y,
			'@cspell': cspellPlugin,
		},
		settings: {
			preact: { version: 'detect' },
			react: { version: 'detect' },
		},
		rules: {
			// Base SonarJS Rules
			...sonarjs.configs.recommended.rules,

			// ESLint Core Rules
			'accessor-pairs': 'error',
			'brace-style': 'error',
			'getter-return': 'error',
			'new-cap': 'error',
			'no-async-promise-executor': 'error',
			'no-dupe-keys': 'error',
			'no-extend-native': 'error',
			'no-lonely-if': 'error',
			'no-nonoctal-decimal-escape': 'error',
			'no-self-compare': 'error',
			'no-throw-literal': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unreachable': 'error',
			'no-unused-private-class-members': 'error',
			'no-useless-call': 'error',
			'no-useless-constructor': 'error',
			'no-useless-escape': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'prefer-object-spread': 'error',
			'prefer-spread': 'error',
			'prefer-template': 'error',
			'use-isnan': 'error',

			// React Rules
			...reactPlugin.configs.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',

			// TypeScript ESLint Rules
			...tseslintPlugin.configs.base.rules,
			...tseslintPlugin.configs.recommended.rules,
			...tseslintPlugin.configs['recommended-type-checked'].rules,
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-dupe-class-members': 'error',
			'@typescript-eslint/no-empty-interface': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-redeclare': 'error',

			// JSX A11y Rules
			'jsx-a11y/alt-text': 'error',
			'jsx-a11y/anchor-has-content': 'error',
			'jsx-a11y/anchor-is-valid': 'error',
			'jsx-a11y/aria-props': 'error',
			'jsx-a11y/click-events-have-key-events': 'error',
			'jsx-a11y/html-has-lang': 'error',
			'jsx-a11y/label-has-associated-control': 'error',
			'jsx-a11y/lang': 'error',
			'jsx-a11y/media-has-caption': 'error',
			'jsx-a11y/mouse-events-have-key-events': 'error',

			// Import Rules
			'import/no-self-import': 'error',

			// Spell Checker Rules
			'@cspell/spellchecker': [
				'warn',
				{
					autoFix: false,
					generateSuggestions: true,
					numSuggestions: 5,
					configFile: './cspell.config.yaml',
				},
			],

			// Unicorn Rules
			'unicorn/better-regex': 'error',
			'unicorn/catch-error-name': 'error',
			'unicorn/consistent-destructuring': 'error',
			'unicorn/consistent-function-scoping': 'error',
			'unicorn/custom-error-definition': 'error',
			'unicorn/error-message': 'error',
			'unicorn/escape-case': 'error',
			'unicorn/explicit-length-check': 'error',
			'unicorn/import-style': 'error',
			'unicorn/new-for-builtins': 'error',
			'unicorn/no-abusive-eslint-disable': 'error',
			'unicorn/no-array-callback-reference': 'error',
			'unicorn/no-array-method-this-argument': 'error',
			'unicorn/no-array-push-push': 'error',
			'unicorn/no-console-spaces': 'error',
			'unicorn/no-empty-file': 'error',
			'unicorn/no-hex-escape': 'error',
			'unicorn/no-instanceof-array': 'error',
			'unicorn/no-invalid-remove-event-listener': 'error',
			'unicorn/no-lonely-if': 'error',
			'unicorn/no-nested-ternary': 'error',
			'unicorn/no-new-array': 'error',
			'unicorn/no-new-buffer': 'error',
			'unicorn/no-object-as-default-parameter': 'error',
			'unicorn/no-process-exit': 'error',
			'unicorn/no-static-only-class': 'error',
			'unicorn/no-this-assignment': 'error',
			'unicorn/no-unreadable-array-destructuring': 'error',
			'unicorn/no-unused-properties': 'error',
			'unicorn/no-useless-fallback-in-spread': 'error',
			'unicorn/no-useless-length-check': 'error',
			'unicorn/no-useless-promise-resolve-reject': 'error',
			'unicorn/no-useless-spread': 'error',
			'unicorn/no-useless-switch-case': 'error',
			'unicorn/no-zero-fractions': 'error',
			'unicorn/prefer-add-event-listener': 'error',
			'unicorn/prefer-array-find': 'error',
			'unicorn/prefer-array-flat': 'error',
			'unicorn/prefer-array-flat-map': 'error',
			'unicorn/prefer-array-index-of': 'error',
			'unicorn/prefer-array-some': 'error',
			'unicorn/prefer-at': 'error',
			'unicorn/prefer-date-now': 'error',
			'unicorn/prefer-default-parameters': 'error',
			'unicorn/prefer-dom-node-append': 'error',
			'unicorn/prefer-dom-node-dataset': 'error',
			'unicorn/prefer-dom-node-remove': 'error',
			'unicorn/prefer-dom-node-text-content': 'error',
			'unicorn/prefer-includes': 'error',
			'unicorn/prefer-keyboard-event-key': 'error',
			'unicorn/prefer-math-trunc': 'error',
			'unicorn/prefer-modern-dom-apis': 'error',
			'unicorn/prefer-module': 'error',
			'unicorn/prefer-negative-index': 'error',
			'unicorn/prefer-node-protocol': 'error',
			'unicorn/prefer-number-properties': 'error',
			'unicorn/prefer-optional-catch-binding': 'error',
			'unicorn/prefer-prototype-methods': 'error',
			'unicorn/prefer-reflect-apply': 'error',
			'unicorn/prefer-regexp-test': 'error',
			'unicorn/prefer-set-has': 'error',
			'unicorn/prefer-spread': 'error',
			'unicorn/prefer-string-replace-all': 'error',
			'unicorn/prefer-string-slice': 'error',
			'unicorn/prefer-string-starts-ends-with': 'error',
			'unicorn/prefer-string-trim-start-end': 'error',
			'unicorn/prefer-switch': 'error',
			'unicorn/prefer-ternary': 'error',
			'unicorn/prefer-top-level-await': 'error',
			'unicorn/prefer-type-error': 'error',
			'unicorn/relative-url-style': 'error',
			'unicorn/require-array-join-separator': 'error',
			'unicorn/require-number-to-fixed-digits-argument': 'error',
			'unicorn/string-content': 'error',
			'unicorn/switch-case-braces': 'error',
			'unicorn/template-indent': 'error',
			'unicorn/text-encoding-identifier-case': 'error',
			'unicorn/throw-new-error': 'error',

			// SonarJS Rules
			'sonarjs/todo-tag': 'off',
		},
	},
];
