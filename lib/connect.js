var get = require('object-path-get')

module.exports = function (node, desc, props, parent) {
  var connect = props ? props.connect : null
  if (!connect) return
  var target = get(parent, connect)
  if (target && node.connect) node.connect(target)
}
