import path from 'path';

export default {
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /.*\.(gif|png|jpe?g|svg)$/i,
            loader: 'file-loader'
        }, {
            test: require.resolve('tinymce/tinymce'),
            loaders: [
                'imports?this=>window',
                'exports?window.tinymce'
            ]
        }, {
            test: /tinymce[\\/](themes|plugins)[\\/]/,
            loader: 'imports?this=>window'
        }, {
            test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/i,
            loader: 'file-loader'
        }]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        // libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    },
    externals: [
        // put your node 3rd party libraries which can't be built with webpack here
        // (mysql, mongodb, and so on..)
    ]
};
