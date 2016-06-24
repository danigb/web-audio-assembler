/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var Assembler = require('..')

test.skip('connect params', function (t) {
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

test.skip('connect nodes', function (t) {
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
