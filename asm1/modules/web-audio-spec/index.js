'use strict'
var is = require('hi-typeof')
var isStr = is('string')
var isObj = is('object')

function init () {
  var defs = {}
  var spec = {
    def: function (name, def) {
      if (defs[name]) throw Error('Type ' + name + ' already defined.')
      defs[name] = def
      return defs[name]
    },
    explain: function (obj) {
      return !obj ? null
        : isStr(obj) ? defs[obj]
        : isObj(obj) ? Object.keys(obj).reduce(function (d, k) {
          d[k] = defs[obj[k]]
          if (!d[k]) throw Error('Property ' + k + ' not valid: ' + obj[k])
          return d
        }, {})
        : null
    }
  }
  Object.keys(PROPS).forEach(function (k) { spec.def(k, PROPS[k]) })
  Object.keys(NODES).forEach(function (k) { spec.def(k, spec.explain(NODES[k])) })
  return spec
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

module.exports = { init: init }
