const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { NODE_ENV } = process.env;

let plugins = [
	// Ignore all locale files of moment.js
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new CleanWebpackPlugin(['dist']),
	new HtmlWebpackPlugin({
		template: './src/index.html',
		alwaysWriteToDisk: true,
	}),
	new FaviconsWebpackPlugin({
		logo: './src/favicon/favicon.png',
		prefix: 'favicon/',
	}),
	new HtmlWebpackHarddiskPlugin(),
	new CopyWebpackPlugin(['./src/_redirects']),
];

const isDevelopment = NODE_ENV === 'development';

if (isDevelopment) {
	plugins = plugins.concat(new BundleAnalyzerPlugin());
}

module.exports = {
	entry: ['./src/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: isDevelopment ? '[name].js' : '[name].[chunkhash:8].js',
	},
	optimization: {
		splitChunks: {
			chunks: 'initial',
		},
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							insertAt: 'top',
						},
					},
					'css-loader',
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
					},
				],
			},
		],
	},
};
