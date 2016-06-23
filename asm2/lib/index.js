var is = require('hi-typeof')
var get = require('object-path-get')
var mapValues = require('map-values')
var nodes = require('./nodes')

var isArr = Array.isArray
var isStr = is('string')
var isObj = is('object')
var isDef = is('undefined', false)
var E = {}

function descNode (desc) { return isArr(desc) ? desc[0] : desc }
function descProps (desc) { return isArr(desc) && desc[1] ? desc[1] : E }

function assembler (desc) {
  return function (ac) {
    var node = assemble(ac, desc)
    return node
  }
}

function assemble (ac, desc) {
  var node
  node = build(ac, desc)
  apply(setProperties, node, desc)
  apply(setConnection, node, desc)
  return node
}

function build (ac, desc) {
  var factory = descNode(desc)

  return isStr(factory) ? createNode(ac, factory)
    : isObj(factory) ? mapValues(factory, function (v) { return build(ac, v) })
    : null
}

function apply (fn, node, desc, parent) {
  var factory = descNode(desc)
  var props = descProps(desc)
  if (isObj(factory)) {
    Object.keys(factory).forEach(function (k) {
      apply(fn, node[k], get(factory, k), node)
    })
  }
  fn(node, factory, props, parent)
  return node
}

function setConnection (node, nodeDesc, props, parent) {
  var connect = props ? props.connect : null
  if (!connect) return
  var target = parent ? get(parent, connect) : null
  if (target && node.connect) node.connect(target)
}

function setProperties (node, nodeDesc, props) {
  if (isStr(nodeDesc)) {
    var spec = nodes.explain(nodeDesc + 'Node')
    if (spec) setNodeProperties(node, spec, props)
  } else {
    Object.keys(props).forEach(function (k) {
      var ndx = k.lastIndexOf('.')
      var location = k.slice(0, ndx)
      var prop = k.slice(ndx + 1)
      var target = get(node, location)
      var def = descNode(get(nodeDesc, location))
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
    else if (isDef(target.value)) target.value = value
    else if (node[k]) node[k] = value
  })
}

function createNode (ac, name) {
  var cons = 'create' + name
  return ac[cons]()
}

module.exports = assembler
