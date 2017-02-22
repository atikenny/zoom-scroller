const webpack       = require('webpack');
const path          = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './zoom-scroller.js',
    output: {
        filename: 'zoom-scroller.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            'check-es2015-constants',
                            'transform-es2015-block-scoping',
                            'transform-es2015-arrow-functions'
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'examples'),
        compress: true,
        port: 3000
    }
}
