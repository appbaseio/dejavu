var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		live: [path.join(__dirname, 'live/src/js/app.js')],
		importer: [path.join(__dirname, 'importer/js/app.js')]
	},
	output: {
		path: path.join(__dirname, './bundle'),
		publicPath: '/bundle/',
		filename: '[name].js'
	},
	devtool: false,
	module: {
		loaders: [{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'stage-0', 'react'],
					plugins: ['emotion', [
						"import",
						{ "libraryName": "antd", "libraryDirectory": "es", "style": "css" }
					]]
				}
			}, {
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang-loader', 'babel-loader']
			}, { test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	externals: ['ws'],
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				join_vars: true,
				if_return: true
			},
			output: {
				comments: false
			}
		})
	]
};
