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
	['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
	// [
	// 	'direct-import',
	// 	[
	// 		'@appbaseio/reactivesearch',
	// 		{
	// 			name: '@appbaseio/reactivesearch',
	// 			indexFile: '@appbaseio/reactivesearch/lib/index.es.js',
	// 		},
	// 	],
	// ],
];

// tree shaking in reactivesearch with direct-import is broken with babel 7

module.exports = { presets, plugins };
