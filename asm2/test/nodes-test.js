/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

test('create gain', function (t) {
  var ac = new AudioContext()
  var g = assembler(['Gain', { gain: 2 }])(ac)
  t.assert(g)
  t.equal(g.gain.value, 2)
  t.end()
})

test('create oscillators', function (t) {
  var ac = new AudioContext()
  var node = assembler(['Oscillator', { type: 'square', frequency: 880 }])(ac)
  t.assert(node)
  t.equal(node.type, 'square')
  t.equal(node.frequency.value, 880)
  t.end()
})

test('create filter', function (t) {
  var ac = new AudioContext()
  var node = assembler(['BiquadFilter', { frequency: 400 }])(ac)
  t.assert(node)
  t.equal(node.frequency.value, 400)
  t.end()
})

test('create delay node', function (t) {
  var ac = new AudioContext()
  var node = assembler(['Delay', { delayTime: 0.5 }])(ac)
  t.equal(node.delayTime.value, 0.5)
  t.end()
})
