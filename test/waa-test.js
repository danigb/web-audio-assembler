/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var waa = require('..')

test('create gain', function (t) {
  var ac = new AudioContext()
  var g = waa.assemble({ node: 'gain' })
  t.assert(g)
  t.assert(g(ac))
  t.assert(g(ac).gain)
  t.end()
})

test('create oscillators', function (t) {
  var ac = new AudioContext()
  var node = waa.assemble({ node: 'oscillator', type: 'square', frequency: 880 })(ac)
  t.assert(node)
  t.equal(node.type, 'square')
  t.equal(node.frequency.value, 880)
  t.end()
})

test('connect to audio context', function (t) {
  var ac = new AudioContext()
  waa.assemble({ node: 'oscillator', connect: '$context' })(ac)
  t.equal(ac.toJSON().inputs.length, 1)
  t.equal(ac.toJSON().inputs[0].name, 'OscillatorNode')
  t.end()
})

test('create audio graph', function (t) {
  var Synth = waa.assemble({
    name: 'simple-synth',
    amp: { node: 'gain', connect: '$context' },
    filter: { node: 'filter', frequency: 400, connect: 'amp' },
    osc: { node: 'oscillator', connect: 'filter' }
  })
  var ac = new AudioContext()
  var node = Synth(ac)
  t.assert(node)
  var next = ac.toJSON()
  t.equal(next.inputs.length, 1)
  t.equal(next.inputs[0].name, 'GainNode')
  next = next.inputs[0]
  t.equal(next.name, 'GainNode')
  t.equal(next.inputs.length, 1)
  next = next.inputs[0]
  t.equal(next.name, 'BiquadFilterNode')
  t.equal(next.inputs.length, 1)
  next = next.inputs[0]
  t.equal(next.name, 'OscillatorNode')
  t.equal(next.inputs.length, 0)
  t.end()
})
