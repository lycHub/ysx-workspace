const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    pxtorem({
      rootValue: 16,
      unitPrecision: 4,
      propList: ['*', '!border*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 4,
      exclude: /node_modules/i
  })
  ]
}