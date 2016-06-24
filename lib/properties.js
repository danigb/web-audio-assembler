var is = require('hi-typeof')
var nodes = require('./nodes')
var get = require('object-path-get')

var isStr = is('string')
var isNum = is('number')
var isDef = is('undefined', false)

module.exports = function (node, nodeDesc, props, parent) {
  if (isStr(nodeDesc)) {
    var spec = nodes.explain(nodeDesc + 'Node')
    if (spec) setNodeProperties(node, spec, props)
  } else {
    Object.keys(props).forEach(function (k) {
      var ndx = k.lastIndexOf('.')
      var location = k.slice(0, ndx)
      var prop = k.slice(ndx + 1)
      var target = get(node, location)
      var def = get(nodeDesc, location)[0]
      var value = props[k]
      setNodeProperty(target, prop, value, def)
    })
  }
}

function setNodeProperty (node, name, value, def) {
  if (!node[name]) return
  if (isDef(node[name].value)) node[name].value = value
  else node[name] = value
}

function setNodeProperties (node, spec, props) {
  Object.keys(spec).forEach(function (k) {
    var target = node[k]
    var value = props[k]
    if (!target || !value) return
    else if (isDef(target.value)) {
      if (isNum(value)) target.value = value
    } else if (node[k]) node[k] = value
  })
}
