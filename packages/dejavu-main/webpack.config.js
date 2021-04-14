const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteWebPackPlugin = require('write-file-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';

const plugins = [
	// Ignore all locale files of moment.js
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new CleanWebpackPlugin([path.resolve(__dirname, 'dist/app')]),
	new HtmlWebpackPlugin({
		template: './app/index.html',
		alwaysWriteToDisk: true,
	}),
	new FaviconsWebpackPlugin({
		logo: './app/src/favicon/favicon.png',
		prefix: 'favicon/',
	}),
	new HtmlWebpackHarddiskPlugin(),
	new CopyWebpackPlugin(['./app/src/_redirects', 'chrome-specific']),
	new WriteWebPackPlugin(),
];

if (!isDevelopment) {
	plugins.push(
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:8].css',
			chunkFilename: '[name].[contenthash:8].css',
		}),
	);
	plugins.push(
		new CompressionPlugin({
			filename: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8,
		}),
	);
	plugins.push(
		new CompressionPlugin({
			filename: '[path].br[query]',
			algorithm: 'brotliCompress',
			test: /\.(js|css|html|svg)$/,
			compressionOptions: {
				level: 11,
			},
			threshold: 10240,
			minRatio: 0.8,
		}),
	);
}

module.exports = {
	entry: [path.resolve(__dirname, 'app/src/index.js')],
	output: {
		path: path.resolve(__dirname, 'dist/app'),
		publicPath: '/',
		filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
		chunkFilename: isDevelopment
			? '[name].bundle.js'
			: '[name].[contenthash:8].js',
	},
	optimization: {
		moduleIds: 'hashed',
		runtimeChunk: {
			name: 'manifest',
		},
		minimizer: isDevelopment
			? []
			: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
		splitChunks: {
			cacheGroups: {
				// Splitting React into a different bundle
				common: {
					test: /[\\/]node_modules[\\/](react|react-dom|antd)[\\/]/,
					name: 'common',
					chunks: 'all',
				},
			},
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
					isDevelopment
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg|woff|woff2|ttf|eot)$/i,
				use: ['file-loader'],
			},
		],
	},
};
