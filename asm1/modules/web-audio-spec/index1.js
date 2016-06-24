'use strict'
var CR = /\[object\s+([^\]]+)\]/
function type (node) { var n = CR.exec(toString.call(node)); return n ? n[1] : null }

function spec (name) {
  return propSpec(name) || nodeSpec(name)
}

function propSpec (name) {
  return PROPS[name]
}

spec.propNames = function () { return Object.keys(PROPS) }
spec.nodeNames = function () { return Object.keys(NODES) }

function nodeName (name) {
  return NODES[name] ? name
    : NODES[name + 'Node'] ? name + 'Node'
    : NODES[type(name)] ? type(name) : null
}

function nodeSpec (name) {
  var obj = NODES[nodeName(name)] || name
  var desc = {}
  for (var key in obj) {
    desc[key] = propSpec(obj[key])
    if (!desc[key]) throw Error('Not valid key: ' + key)
  }
  return desc
}

var NODES = {
  GainNode: {
    gain: 'gain'
  },
  OscillatorNode: {
    detune: 'detune',
    frequency: 'frequency',
    type: 'oscillator-type',
    start: 'start',
    stop: 'stop',
    onended: 'onended'
  },
  BiquadFilterNode: {
    frequency: 'frequency',
    detune: 'detune',
    Q: 'q',
    gain: 'gain',
    type: 'filter-type'
  },
  DelayNode: {
    delayTime: 'delay-time'
  },
  ConvolverNode: {
    buffer: 'buffer',
    normalize: 'boolean'
  }
}

var PROPS = {
  'gain': { type: 'a-rate', defaultValue: 1, min: -Infinity, max: Infinity },
  'detune': { type: 'a-rate', units: 'Cents', defaultValue: 0, min: -Infinity, max: Infinity },
  'q': { type: 'a-rate', defaultValue: 1, min: 0.0001, max: 1000 },
  'frequency': { type: 'a-rate', units: 'Hz', defaultValue: 440, min: 0, max: 40000 },
  'delay-time': { type: 'a-rate', units: 'Seconds', defaultValue: 0, min: 0, max: Infinity },
  'oscillator-type': { type: 'select', defaultValue: 'sine',
    values: ['sine', 'square', 'sawtooth', 'triangle', 'custom'] },
  'filter-type': { type: 'select', defaultValue: 'lowpass',
    values: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'] },
  'onended': { type: 'event', value: 'ended' },
  'start': { type: 'trigger', value: 'start' },
  'stop': { type: 'trigger', value: 'stop' },
  'buffer': { type: 'Buffer' },
  'boolean': { type: 'select', defaultValue: true, values: [true, false] }
}

module.exports = {
  propNames: propNames, nodeNames: nodeNames,
  propSpec: propSpec, nodeSpec: nodeSpec
}
