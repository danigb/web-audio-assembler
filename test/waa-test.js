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

test('connect to audio context', function (t) {
  var ac = new AudioContext()
  Assembler.assemble({ node: 'Oscillator', connect: '$context' })(ac)
  t.equal(ac.toJSON().inputs.length, 1)
  t.equal(ac.toJSON().inputs[0].name, 'OscillatorNode')
  t.end()
})

test('connect params', function (t) {
  var ac = new AudioContext()
  var Synth = Assembler.assemble({
    vca: { node: 'Gain', connect: '$context' },
    lfo: { node: 'Oscillator', frequency: 10, connect: 'vca.gain' }
  })
  var synth = Synth(ac)
  t.ok(synth)
  var dest = ac.toJSON()
  t.equal(dest.name, 'AudioDestinationNode')
  var gain = dest.inputs[0]
  t.assert(gain)
  t.equal(gain.name, 'GainNode')
  var lfo = gain.gain.inputs[0]
  t.assert(lfo)
  t.equal(lfo.name, 'OscillatorNode')
  t.end()
})

test('connect nodes', function (t) {
  var Synth = Assembler.assemble({
    name: 'simple-synth',
    amp: { node: 'Gain', connect: '$context' },
    filter: { node: 'BiquadFilter', frequency: 400, connect: 'amp' },
    osc: { node: 'Oscillator', connect: 'filter' }
  })
  var ac = new AudioContext()
  var synth = Synth(ac)
  t.assert(synth)
  var node = ac.toJSON()
  t.equal(node.name, 'AudioDestinationNode')
  t.equal(node.inputs.length, 1)
  node = node.inputs[0]
  t.equal(node.name, 'GainNode')
  t.equal(node.inputs.length, 1)
  node = node.inputs[0]
  t.equal(node.name, 'BiquadFilterNode')
  t.equal(node.inputs.length, 1)
  node = node.inputs[0]
  t.equal(node.name, 'OscillatorNode')
  t.equal(node.inputs.length, 0)
  t.end()
})

test('schedule values', function (t) {
  var ac = new AudioContext()
  var Synth = Assembler.assemble({ osc: { node: 'Oscillator', frequency: 440 } })
  var node = Synth(ac)
  t.equal(node.osc.frequency.value, 440)
  Assembler.schedule(node, ac.currentTime, [
    { target: 'osc.frequency', value: 880 }
  ])
  t.equal(node.osc.frequency.value, 880)
  t.end()
})
