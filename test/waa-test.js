/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var waa = require('..')

test('create oscillators', function (t) {
  var ac = new AudioContext()
  var node = waa.assemble({ node: 'oscillator', frequency: 880 })(ac)
  t.assert(node)
  t.equal(node.type, 'square')
  t.equal(node.frequency.value, 880)
  t.end()
})

test('connect to audio context', function (t) {
  var ac = new AudioContext()
  waa.assemble({ node: 'oscillator', connect: true })(ac)
  t.equal(ac.toJSON().inputs.length, 1)
  t.equal(ac.toJSON().inputs[0].name, 'OscillatorNode')
  t.end()
})
