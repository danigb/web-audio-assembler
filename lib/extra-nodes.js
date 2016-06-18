var Noise = require('noise-buffer')
var E = {}

module.exports = function (graph, ac) {
  var Node = NODES[graph.node]
  if (!Node) return graph
  var node = Node.create(ac, graph)
  return node
}

var NODES = {
  Noise: {
    descriptor: {
      duration: 'number',
      loop: 'boolean',
      onended: 'event'
    },
    create: function createNoiseNode (ac, options) {
      var opts = options || E
      var source = ac.createBufferSource()
      source.buffer = Noise(opts.duration || 1)
      source.loop = true
      return source
    }
  }
}
