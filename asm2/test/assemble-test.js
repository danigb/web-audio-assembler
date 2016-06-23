/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

function nodeType (node) { return node.toJSON().name }

test('create a node', function (t) {
  var ac = new AudioContext()
  var gain = assembler(['Gain'])(ac)
  t.assert(gain)
  t.equal(gain.gain.value, 1)
  t.end()
})

test('create a context', function (t) {
  var ac = new AudioContext()
  var nodes = assembler({
    out: ['Gain', { gain: 2 }],
    in: ['Gain', { gain: 3 }]
  })(ac)
  t.assert(nodes)
  t.assert(nodes.out)
  t.equal(nodes.out.gain.value, 2)
  t.assert(nodes.in)
  t.equal(nodes.in.gain.value, 3)
  t.end()
})

test('create sub-context', function (t) {
  var ac = new AudioContext()
  var nodes = assembler({
    out: ['Gain'],
    voice: {
      gain: ['Gain'],
      osc: ['Oscillator']
    }
  })(ac)
  t.assert(nodes)
  t.equal(nodeType(nodes.out), 'GainNode')
  t.assert(nodes.voice)
  t.equal(nodeType(nodes.voice.gain), 'GainNode')
  t.equal(nodeType(nodes.voice.osc), 'OscillatorNode')
  t.end()
})
