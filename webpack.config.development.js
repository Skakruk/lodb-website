import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const port = process.env.PORT || 3002;

export default merge(baseConfig, {
        debug: true,
        entry: [
            `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
            'babel-polyfill',
            './app/index'
        ],

        devtool: 'eval-source-map',

        output: {
            publicPath: `http://localhost:${port}/dist/`,
            filename: 'bundle.js'
        },

        module: {
            loaders: [
                {
                    test: /\.global\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader?sourceMap'
                    ]
                },

                {
                    test: /^((?!\.global).)*\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
                    ]
                }
            ]
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            })
        ]
    })
