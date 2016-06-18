/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var Assembler = require('..')

test('create gain', function (t) {
  var ac = new AudioContext()
  var g = Assembler.assemble({ node: 'Gain' })
  t.assert(g)
  t.assert(g(ac))
  t.assert(g(ac).gain)
  t.end()
})

test('create oscillators', function (t) {
  var ac = new AudioContext()
  var node = Assembler.assemble({ node: 'Oscillator', type: 'square', frequency: 880 })(ac)
  t.assert(node)
  t.equal(node.type, 'square')
  t.equal(node.frequency.value, 880)
  t.end()
})

test('create filter', function (t) {
  var ac = new AudioContext()
  var node = Assembler.assemble({ node: 'BiquadFilter', frequency: 400 })(ac)
  t.equal(node.frequency.value, 400)
  t.end()
})

test('create delay node', function (t) {
  var ac = new AudioContext()
  var node = Assembler.assemble({ node: 'Delay', delayTime: 0.5 })(ac)
  t.equal(node.delayTime.value, 0.5)
  t.end()
})
