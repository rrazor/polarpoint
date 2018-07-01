module.exports = {
  devServer: {
    contentBase: './dist',
    disableHostCheck: true,
    host: '0.0.0.0',
    https: true
  },
  entry: {
    index: './src/index.js',
    'celestial-ui': './src/celestial-ui.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  mode: 'development'
};
