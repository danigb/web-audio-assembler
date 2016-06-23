var explain = require('web-audio-spec').init().explain

module.exports = function (ac, nodes, graph) {
  for (var name in graph) {
    var desc = graph[name]
    var exp = explain(desc.node + 'Node')
    if (exp) nodes[name] = construct(ac, desc, exp)
  }
}

function construct (ac, desc, exp) {
  var cons = 'create' + desc.node
  var node = ac[cons]()
  Object.keys(exp).forEach(function (k) {
    setValue(node, k, desc[k], exp[k])
  })
  return node
}

function setValue (node, name, value, spec) {
  if (!value || !spec) return
  if (spec.type === 'a-rate') node[name].value = value
}
