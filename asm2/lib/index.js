var is = require('hi-typeof')
var get = require('object-path-get')
var mapValues = require('map-values')

var isArr = Array.isArray
var isStr = is('string')
var isObj = is('object')
var E = {}

function assembler (desc) {
  if (!isArr(desc)) desc = [desc]
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
  // node = properties(node, desc)
  // node = connect(node, desc)
  return node
}

function build (ac, desc) {
  var factory = desc[0]

  return isStr(factory) ? createNode(ac, factory)
    : isObj(factory) ? mapValues(factory, function (v) { return build(ac, v) })
    : null
}

function apply (fn, node, desc, parent) {
  var factory = desc[0]
  var props = desc[1] || E
  if (hasChildren(desc)) {
    Object.keys(factory).forEach(function (k) {
      properties(fn, node[k], get(factory, k), node)
    })
  }
  fn(node, props, parent)
  return node
}

function properties (node, desc, parent) {
  var factory = desc[0]
  var props = desc[1] || E
  if (hasChildren(desc)) {
    Object.keys(factory).forEach(function (k) {
      properties(node[k], get(factory, k), node)
    })
  }
  setProperties(node, props, parent)
  return node
}

function connect (node, desc, parent) {
  var factory = desc[0]
  var props = desc[1] || E
  if (hasChildren(desc)) {
    Object.keys(factory).forEach(function (k) {
      connect(node[k], get(factory, k), node)
    })
  }
  setConnection(node, props, parent)
  return node
}

function setConnection (node, props, parent) {
  var connect = props ? props.connect : null
  if (!connect) return
  var target = parent ? get(parent, connect) : null
  if (target && node.connect) node.connect(target)
}

function setProperties (node, props) {
  Object.keys(props).forEach(function (k) {
    var target = get(node, k)
    var value = props[k]
    if (!target || !value) return
    else if (target.value) target.value = value
  })
}

function hasChildren (desc) { return desc[0] && isObj(desc[0]) }


function createNode (ac, name) {
  var cons = 'create' + name
  return ac[cons]()
}

module.exports = assembler
