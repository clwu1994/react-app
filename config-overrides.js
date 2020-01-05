const { override, addLessLoader } = require('customize-cra');

module.exports = override(
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    localIdentName: "[local]--[hash:base64:5]"
  })
)