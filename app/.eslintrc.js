const graphQLConfig = require('./graphql.config');

module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true
	},
	plugins: ['react', 'react-hooks', 'prettier', 'simple-import-sort', 'json-format'],
	extends: ['@magento', 'plugin:react/recommended', 'prettier', 'eslint:recommended'],
	parserOptions: {
		requireConfigFile: false,
		ecmaFeatures: {
			tsx: false
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
		babelOptions: {
			babelrc: false,
			configFile: false,
			// your babel options
			presets: ['@babel/preset-react']
		}
	},
	ignorePatterns: ['!.*', 'dist', 'node_modules', 'graphql-cli-validate-magento-pwa-queries', 'storybook-dist'],
	rules: {
		// 'camelcase': 'error',
		'indent': [
			'error',
			'tab',
			{
				SwitchCase: 1,
				ignoredNodes: ['ConditionalExpression']
			}
		],
		'jsx-a11y/label-has-associated-control': [
			'error',
			{
				required: {
					some: ['nesting', 'id']
				}
			}
		],
		'jsx-a11y/media-has-caption': 'off',
		'jsx-a11y/no-autofocus': 'off',
		'jsx-a11y/no-noninteractive-element-interactions': 'off',
		'jsx-a11y/label-has-for': 'off',
		'linebreak-style': ['error', 'unix'],
		// 'max-len': ['error', 140],
		// 'no-alert': 'error',
		'no-async-promise-executor': 'off',
		// 'no-console': ['error'],
		'no-duplicate-imports': 'error',
		'no-empty': 'off',
		'no-import-assign': 'off',
		'no-inner-declarations': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'no-param-reassign': 'off',
		'no-process-exit': 'off',
		'no-prototype-builtins': 'off',
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'no-useless-escape': 'off',
		'node/no-missing-require': 'off',
		'node/no-unpublished-require': 'off',
		'quotes': [2, 'single', { avoidEscape: true }],
		'react/display-name': 0,
		'react-hooks/exhaustive-deps': 'off',
		'react/jsx-no-literals': 'off',
		'react/no-children-prop': 'off',
		// 'react/no-unknown-property': 'off',
		// 'react/no-unescaped-entities ': 'off',
		'react/prop-types': 0,
		// 'react/react-in-jsx-scope': 'off',
		'semi': ['error', 'always'],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error'
	},
	// overrides: [
	// 	{
	// 		files: ['**/*.gql*.js'],
	// 		processor: '@graphql-eslint/graphql'
	// 	},
	// 	{
	// 		files: ['*.graphql'],
	// 		parser: '@graphql-eslint/eslint-plugin',
	// 		parserOptions: {
	// 			operations: graphQLConfig.documents,
	// 			schema: graphQLConfig.schema,
	// 			schemaOptions: {
	// 			 	assumeValid: true,
	// 			 	method: 'GET'
	// 			},
	// 			skipGraphQLConfig: true
	// 		},
	// 		plugins: ['@graphql-eslint'],
	// 		rules: {
	// 			'@graphql-eslint/known-directives': 'error',
	// 			'@graphql-eslint/naming-convention': [
	// 				'error',
	// 				{
	// 					ObjectTypeDefinition: 'PascalCase',
	// 					allowLeadingUnderscore: true
	// 				}
	// 			],
	// 			'@graphql-eslint/require-id-when-available': 'error'
	// 		}
	// 	}
	// ],
	settings: {
		react: {
			version: 'detect'
		}
	}
};
