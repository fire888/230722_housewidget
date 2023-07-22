const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{ test: /\.txt$/, use: 'raw-loader' },
			{
                test: /\.(png|svg|jpg|gif|ttf)$/,
                use: [{
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'obj/'
                  }
                }]
            },
              { test: /\.(obj|glb|FBX|fbx|3DS|3ds)$/,
                use: [{
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'obj/'
                  }
                }]
              },
            {
                test: /\.css$/i,
                use: ['css-loader', 'style-loader']
            },

		]
	},
	plugins: [
		new HtmlWebpackPlugin({template: './templates/index.html'}),
		new webpack.ProvidePlugin({
			THREE: 'three'
		})
	]
};
