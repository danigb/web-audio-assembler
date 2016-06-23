/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

test('set properties to a node', function (t) {
  var ac = new AudioContext()
  var gain = assembler(['Gain', { gain: 0.5 }])(ac)
  t.assert(gain)
  t.equal(gain.gain.value, 0.5)
  t.end()
})

test('set properties to a context', function (t) {
  var ac = new AudioContext()
  var nodes = assembler([{ out: ['Gain'] }, { 'out.gain': 2 }])(ac)
  t.assert(nodes)
  t.assert(nodes.out)
  t.equal(nodes.out.gain.value, 2)
  t.end()
})
