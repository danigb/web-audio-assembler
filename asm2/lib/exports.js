var is = require('hi-typeof')
var isStr = is('string')

module.exports = function (node, nodeDesc, props, parent) {
  Object.keys(props).forEach(function (key) {
    var value = props[key]
    if (!isExport(value)) return
    if (key === 'connect') exportConnection(node, parent)
  })
}

function exportConnection (node, parent) {
  if (!node.connect) return
  var _connect = node.connect
  parent = parent || node
  parent.connect = function (dest) {
    _connect.call(node, dest)
    return parent
  }
}

function isExport (value) {
  return isStr(value) && value[0] === '$'
}
