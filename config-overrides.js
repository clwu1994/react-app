const { override } = require('customize-cra');

module.exports = override({
  resolve: {
    extensions: ['', '.js', '.styl']
  },
  loaders: [{
    test: /\.styl$/,
    loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
  },
  {
    test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'
  }]
})