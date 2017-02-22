const webpack       = require('webpack');
const path          = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        'zoom-scroller': './zoom-scroller.js',
        'specs': './specs.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ],
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
                            'transform-es2015-arrow-functions',
                            'transform-es2015-template-literals',
                            'transform-es2015-shorthand-properties'
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
