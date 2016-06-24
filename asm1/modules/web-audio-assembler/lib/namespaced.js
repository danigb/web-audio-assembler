
function namespace (src) {
  var obj = JSON.parse(JSON.stringify(src))
  return flat({}, null, obj)
}

namespace.expand = function (ns) {
  if (ns[null]) return ns[null]
  var obj = {}
  Object.keys(ns).forEach(function (k) {
    var path = k.split('.')
    var last = path.length - 1
    path.reduce(function (o, p, i) {
      o[p] = i === last ? ns[k] : o[p] || {}
      return o[p]
    }, obj)
  })
  return obj
}

function flat (dest, name, node) {
  if (isNS(node)) {
    Object.keys(node).forEach(function (k) {
      flat(dest, name ? name + '.' + k : k, node[k])
    })
  } else {
    dest[name] = node
  }
  return dest
}

function isNS (node) {
  for (var k in node) {
    if (node[k] === null || typeof node[k] !== 'object') return false
  }
  return true
}

module.exports = namespace
