const path = require('path');
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");


module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ExtractTextWebpackPlugin.extract({
                    use: "css-loader",
                }),
            },
        ],
    },
    plugins: [new ExtractTextWebpackPlugin("styles.css")],
};