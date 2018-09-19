module.exports = {
	extends: ['airbnb', 'prettier'],
	plugins: ['prettier'],
	env: {
		browser: true,
	},
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
		'prettier/prettier': 'error',
	},
};
