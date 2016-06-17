'use strict'
var get = require('object-path-get')
var is = require('hi-typeof')
var isNum = is('number')
var isFn = is('function')

/**
 * Assemble a node or node graph object
 * @param {Object} obj - the node or node graph description
 * @param {AudioContext} ac - (Optional) the audio context
 * @return {Function|AudioNode} a function that creates the node or node graph
 * or the node graph if AudioContext is provided
 * @example
 * var Assembler = require('web-audio-assembler')
 * // create a node generator function
 + var osc = Assembler.assemble({ node: 'Oscillator' })
 * var ac = new AudioContext()
 * osc(ac).start()
 * // create the node directly
 * Assembler.assemble({ node: 'Oscillator', frequency: 880 }, ac).start()
 */
function assemble (obj, ac) {
  if (arguments.length > 1) return assemble(obj)(ac)

  return function (ac) {
    var n = buildNode(ac, obj) || Object.keys(obj).reduce(function (n, k) {
      n[k] = buildNode(ac, obj[k])
      return n
    }, {})
    makeConnections(ac, n, obj, n)
    return n
  }
}

/**
 * Schedule update events.
 *
 * @param {AudioNode|Object} graph - the node or node graph to schedule to
 * @param {Float} when - the time to start the schedule
 * @param {Array} events - the list of events
 */
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

/**
 * Start a node or graph
 * @function start
 * @param {AudioNode|Object} graph - the node or graph of nodes
 * @param {Float} when - when to stop the nodes
 */
var start = map(pluckFn('start'))

/**
 * Stop a node or graph of nodes
 * @function stop
 * @param {AudioNode|Object} graph - the node or graph of nodes
 * @param {Float} when - when to stop the nodes
 */
var stop = map(pluckFn('stop'))

/**
 * Disconnect a node or graph of nodes
 * @function disconnect
 * @param {AudioNode|Object} graph - the node or graph of nodes
 * @param {Float} when - when to stop the nodes
 */
var disconnect = map(pluckFn('disconnect'))

var Assembler = { assemble: assemble, schedule: schedule,
  start: start, stop: stop, disconnect: disconnect }

function map (fn) {
  return function (graph, ctx) {
    return [fn(graph, ctx)].concat(Object.keys(graph).map(function (k) {
      return fn(graph[k], ctx)
    }))
  }
}

function pluckFn (name) {
  return function (obj, ctx) {
    if (isFn(obj[name])) obj[name](ctx)
  }
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

function buildNode (ac, obj) {
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
