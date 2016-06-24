var getSpec = require('./spec')()

module.exports = function buildNode (graph, ac) {
  var param = PARAMS[graph.node]
  if (!param) return graph
  var constructor = ac['create' + graph.node]
  var cp = graph.node === 'Delay' ? (graph.maxDelay || 1) : void 0
  var node = constructor.call(ac, cp)
  Object.keys(graph).forEach(function (k) {
    var spec = getSpec(param[k])
    if (spec) spec.set(node, k, graph[k])
  })
  return node
}

var PARAMS = {
  Gain: {
    gain: 'a-rate'
  },
  Oscillator: {
    frequency: 'a-rate',
    detune: 'a-rate',
    type: 'oscillator-type'
  },
  BiquadFilter: {
    frequency: 'a-rate',
    detune: 'a-rate',
    Q: 'a-rate',
    gain: 'a-rate',
    type: 'filter-type'
  },
  Delay: {
    delayTime: 'a-rate'
  }
}
