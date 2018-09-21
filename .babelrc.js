const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

const presets = [
	'@babel/preset-react',
	[
		'@babel/env',
		{
			targets: {
				edge: '17',
				firefox: '60',
				chrome: '67',
				safari: '11.1',
			},
			useBuiltIns: 'usage',
		},
	],
];

const plugins = [
	[
		'emotion',
		isProduction ? { hoist: true } : { sourceMap: true, autoLabel: true },
	],
	['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
];

module.exports = { presets, plugins };
