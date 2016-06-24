var get = require('object-path-get')

module.exports = function (node, nodeDesc, props, parent) {
  var connect = props ? props.connect : null
  if (!connect) return
  var target = parent ? get(parent, connect)
    : connect === 'destination' ? node.context.destination
    : null
  if (target && node.connect) node.connect(target)
}
