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
		ecmaFeatures: {
			tsx: false
		},
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	ignorePatterns: ['!.*', 'dist', 'node_modules', 'graphql-cli-validate-magento-pwa-queries', 'storybook-dist'],
	rules: {
		//camelcase: 'error',
		'no-duplicate-imports': 'error',
		'react/react-in-jsx-scope': 'off',
		'no-alert': 'error',
		'indent': [
			'error',
			'tab',
			{
				SwitchCase: 1,
				ignoredNodes: ['ConditionalExpression']
			}
		],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		//'no-console': ['error'],
		'no-unused-vars': ['error', { vars: 'all' }],
		'no-prototype-builtins': 'off',
		'no-undef': 'off',
		'no-useless-escape': 'off',
		// 'react/jsx-no-literals': [
		//     'error',
		//     {
		//         allowedStrings: [],
		//         // Use ignoreProps: false to catch label/title/alt text, etc.
		//         // Has the downside of erroring on "id" and other string props.
		//         ignoreProps: true,
		//         noStrings: false
		//     }
		// ],
		'react-hooks/exhaustive-deps': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'react/prop-types': 0,
		'react/display-name': 0,
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'react/no-unknown-property': 'off',
		'react/no-unescaped-entities ': 'off'
	},
	overrides: [
		{
			files: ['**/*.gql*.js'],
			processor: '@graphql-eslint/graphql'
		},
		{
			files: ['*.graphql'],
			parser: '@graphql-eslint/eslint-plugin',
			parserOptions: {
				operations: graphQLConfig.documents,
				schema: graphQLConfig.schema,
				schemaOptions: {
					assumeValid: true,
					method: 'GET'
				},
				skipGraphQLConfig: true
			},
			plugins: ['@graphql-eslint'],
			rules: {
				'@graphql-eslint/known-directives': 'error',
				'@graphql-eslint/naming-convention': [
					'error',
					{
						ObjectTypeDefinition: 'PascalCase',
						allowLeadingUnderscore: true
					}
				],
				'@graphql-eslint/require-id-when-available': 'error'
			}
		}
	],
	settings: {
		react: {
			version: 'detect'
		}
	}
};
