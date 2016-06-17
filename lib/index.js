'use strict'
var get = require('object-path-get')
var isNum = require('hi-typeof')('number')

var Assembler = { assemble: assemble, schedule: schedule }

/**
 * Assemble a node or node graph object
 * @param {Object} obj - the node or node graph description
 * @return {Function} a function that creates the node or node graph.
 */
function assemble (obj) {
  return function (ac) {
    var n = node(ac, obj) || Object.keys(obj).reduce(function (n, k) {
      n[k] = node(ac, obj[k])
      return n
    }, {})
    makeConnections(ac, n, obj, n)
    return n
  }
}

function schedule (graph, time, events) {
  events.forEach(function (event) {
    var path = event.target.split('.')
    var node = graph[path[0]]
    var name = node.constructor.name.slice(0, -4)
    var desc = DESCRIPTORS[name]
    if (event.value) {
      var target = desc[path[1]]
      if (!target) throw Error('Target: ' + event.target + ' not found.')
      TYPES[target](node, path[1], event.value)
    } else if (event.trigger) {
      node[event.trigger]()
    }
  })
}

function oneOf (list) {
  return function (node, name, value) {
    if (list.indexOf(value) === -1) {
      throw Error('Not valid "' + name + '" value: ' + value)
    }
    node[name] = value
  }
}

var TYPES = {
  'a-rate': function (node, name, value) {
    if (!isNum(value)) throw Error('An a-rate value must be a number, but was: ' + value)
    node[name].value = value
  },
  'oscillator-type': oneOf(['sine', 'square', 'sawtooth', 'triangle', 'custom']),
  'filter-type': oneOf(['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'])
}

var DESCRIPTORS = {
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

function makeConnections (ac, node, obj, ctx) {
  if (!node) return
  if (obj.connect) {
    if (obj.connect === '$context') return node.connect(ac.destination)
    else {
      var dest = get(ctx, obj.connect)
      if (dest) return node.connect(dest)
    }
  } else {
    Object.keys(node).forEach(function (k) {
      makeConnections(ac, node[k], obj[k], ctx)
    })
  }
}

function node (ac, obj) {
  var desc = DESCRIPTORS[obj.node]
  if (!desc) return null
  var constructor = ac['create' + obj.node]
  var param = obj.node === 'Delay' ? (obj.maxDelay || 1) : void 0
  var node = constructor.call(ac, param)
  Object.keys(obj).forEach(function (k) {
    var setValue = TYPES[desc[k]]
    if (setValue) setValue(node, k, obj[k])
  })
  return node
}

if (typeof module === 'object' && module.exports) module.exports = Assembler
if (typeof window !== 'undefined') window.Assembler = Assembler
