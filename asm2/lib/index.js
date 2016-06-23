var is = require('hi-typeof')
var get = require('object-path-get')
var mapValues = require('map-values')

var isArr = Array.isArray
var isObj = is('object')
var isStr = is('string')
var E = {}

var plugins = [
  require('./properties'),
  require('./connect'),
  require('./exports')
]

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
  plugins.forEach(function (plugin) {
    apply(plugin, node, desc)
  })
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

function createNode (ac, name) {
  var cons = 'create' + name
  return ac[cons]()
}

module.exports = assembler
