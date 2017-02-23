module.exports = {
    entry: ['./test.js'],
    output: {
        path: './dist',
        filename: 'index.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
            }
        }]
    }
};