module.exports = {
  devServer: {
    contentBase: './docs',
    disableHostCheck: true,
    host: '0.0.0.0',
    https: true
  },
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/docs'
  },
  mode: 'development'
};
