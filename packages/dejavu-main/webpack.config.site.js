const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { NODE_ENV } = process.env;

const plugins = [
	// Ignore all locale files of moment.js
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new CleanWebpackPlugin([path.resolve(__dirname, 'dist/site')]),
	new HtmlWebpackPlugin({
		template: './site/index.html',
		alwaysWriteToDisk: true,
	}),
	new FaviconsWebpackPlugin({
		logo: './site/src/favicon/favicon.png',
		prefix: 'favicon/',
	}),
	new HtmlWebpackHarddiskPlugin(),
	new CopyWebpackPlugin(['./site/src/_redirects']),
];

const isDevelopment = NODE_ENV === 'development';

module.exports = {
	entry: ['./site/src/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist/site'),
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
				use: ['file-loader'],
			},
		],
	},
};
