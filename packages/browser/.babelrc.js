const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

const presets = [
	'@babel/preset-react',
	'@babel/preset-flow',
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
	'@babel/plugin-proposal-class-properties',
	'@babel/plugin-transform-spread',
	'@babel/plugin-proposal-object-rest-spread',
	'@babel/plugin-syntax-dynamic-import',
	'@babel/plugin-proposal-export-default-from',
	'@babel/plugin-proposal-nullish-coalescing-operator',
	'@babel/plugin-proposal-optional-chaining',
];

module.exports = { presets, plugins };
