module.exports = {
	extends: [
		'airbnb',
		'prettier',
		'plugin:prettier/recommended',
		'prettier/flowtype',
		'prettier/react',
		'prettier/standard',
	],
	plugins: ['prettier'],
	env: {
		browser: true,
	},
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
		'prettier/prettier': 'error',
	},
};
