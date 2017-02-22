const webpack   = require('webpack');
const path      = require('path');

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
                        presets: ['es2015']
                    }
                }
            }
        ]
    }
}