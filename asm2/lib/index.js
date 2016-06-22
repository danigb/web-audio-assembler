var is = require('hi-typeof')
var get = require('object-path-get')
var mapValues = require('map-values')

var isArr = Array.isArray
var isStr = is('string')
var isObj = is('object')

function assembler (desc) {
  if (!desc) return null
  return function (ac) {
    var node = assemble(ac, {}, desc)
    return node
  }
}

function assemble (ac, ctx, desc, props) {
  if (isArr(desc)) return assemble(ac, ctx, desc[0], desc[1])
  var node
  if (isStr(desc)) {
    node = createNode(ac, desc)
  } else if (isObj(desc)) {
    node = mapValues(desc, function (v) {
      return assemble(ac, ctx, v)
    })
  }
  node = properties(node, props)
  node = connect(ctx, node, props)
  return node
}

function connect (ctx, node, props) {
  if (props && props.connect) {
    var target = get(ctx, props.connect)
    console.log("CONNECT", props.connect, target)
  }
  return node
}

function properties (node, props) {
  if (!props) return node
  Object.keys(props).forEach(function (k) {
    var target = get(node, k)
    var value = props[k]
    if (!target || !value) return
    else if (target.value) target.value = value
  })
  return node
}

function createNode (ac, name) {
  var cons = 'create' + name
  return ac[cons]()
}

module.exports = assembler
