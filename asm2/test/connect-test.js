/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

test('connect a node in a context', function (t) {
  var ac = new AudioContext()
  var nodes = assembler([{
    out: ['Gain'],
    osc: ['Oscillator', { connect: 'out' }] }])(ac)
  t.assert(nodes)
  var inputs = nodes.out.toJSON().inputs
  t.equal(inputs.length, 1)
  t.equal(inputs[0].name, 'OscillatorNode')
  t.end()
})

test('connect a node in a sub-context', function (t) {
  var ac = new AudioContext()
  var nodes = assembler({
    out: ['Gain'],
    voice: {
      gain: ['Gain'],
      osc: ['Oscillator', { connect: 'gain' }]
    }
  })(ac)
  t.assert(nodes)
  var inputs = nodes.voice.gain.toJSON().inputs
  t.equal(inputs.length, 1)
  t.equal(inputs[0].name, 'OscillatorNode')
  t.end()
})
