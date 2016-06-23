/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

test('export connect to a context', function (t) {
  var ac = new AudioContext()
  var nodes = assembler({out: ['Gain', { connect: '$connect' }]})(ac)
  t.assert(nodes)
  t.assert(nodes.connect)
  t.equal(typeof nodes.connect, 'function')
  t.assert(nodes.connect(ac.destination) === nodes)
  var inputs = ac.toJSON().inputs
  t.equal(inputs.length, 1)
  t.deepEqual(inputs[0], nodes.out.toJSON())
  t.end()
})

test('export connect to a node', function (t) {
  var ac = new AudioContext()
  var gain = assembler(['Gain', { connect: '$connect' }])(ac)
  t.assert(gain)
  t.equal(typeof gain.connect, 'function')
  t.assert(gain.connect(ac.destination) === gain)
  var inputs = ac.toJSON().inputs
  t.equal(inputs.length, 1)
  t.deepEqual(inputs[0], gain.toJSON())
  t.end()
})
