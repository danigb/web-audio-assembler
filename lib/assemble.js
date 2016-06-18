
module.exports = function (desc, plugins, ctx) {
  var obj = desc
  plugins.forEach(function (plugin) {
    obj = plugin(obj, ctx, obj)
    Object.keys(obj).forEach(function (k) {
      obj[k] = plugin(obj[k], ctx, obj)
    })
  })
  return obj
}
