/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

test('create a node', function (t) {
  var ac = new AudioContext()
  var gain = assembler(['Gain'])(ac)
  t.assert(gain)
  t.equal(gain.gain.value, 1)
  t.end()
})

test('set properties to a node', function (t) {
  var ac = new AudioContext()
  var gain = assembler(['Gain', { gain: 0.5 }])(ac)
  t.assert(gain)
  t.equal(gain.gain.value, 0.5)
  t.end()
})

test('create a graph', function (t) {
  var ac = new AudioContext()
  var nodes = assembler({ out: ['Gain', { gain: 2 }], in: ['Gain', { gain: 3 }] })(ac)
  t.assert(nodes)
  t.assert(nodes.out)
  t.equal(nodes.out.gain.value, 2)
  t.assert(nodes.in)
  t.equal(nodes.in.gain.value, 3)
  t.end()
})

test('set properties to a graph', function (t) {
  var ac = new AudioContext()
  var nodes = assembler([{ out: ['Gain'] }, { 'out.gain': 2 }])(ac)
  t.assert(nodes)
  t.assert(nodes.out)
  t.equal(nodes.out.gain.value, 2)
  t.end()
})

test('connect a graph', function (t) {
  var ac = new AudioContext()
  var nodes = assembler([{
    out: ['Gain'],
    osc: ['Oscillator', { connect: 'out' }] }])(ac)
  t.assert(nodes)
  console.log(nodes.out['$inputs'])
  t.end()
})
