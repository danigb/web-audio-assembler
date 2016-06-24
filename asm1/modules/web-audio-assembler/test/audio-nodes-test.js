/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var Assembler = require('..')

test('create gain', function (t) {
  var ac = new AudioContext()
  var gain = Assembler.assemble(ac, { node: 'Gain', gain: 0.5 })
  t.assert(gain)
  t.equal(gain.gain.value, 0.5)
  t.end()
})

test('create graph', function (t) {
  var ac = new AudioContext()
  var synth = Assembler.assemble(ac, {
    out: { node: 'Gain', gain: 0.3 }, osc: { node: 'Oscillator', frequency: 100 }
  })
  t.assert(synth)
  t.assert(synth.out)
  t.equal(synth.out.gain.value, 0.3)
  t.assert(synth.osc)
  t.equal(synth.osc.frequency.value, 100)
  t.end()
})

test('deep graph', function (t) {
  var ac = new AudioContext()
  var synth = Assembler.assemble(ac, {
    osc1: { out: { node: 'Gain', from: 'osc', connect: '$dest' }, osc: { node: 'Oscillator' } },
    osc2: { out: { node: 'Gain', from: 'osc', connect: '$dest' }, osc: { node: 'Oscillator' } },
    out: { node: 'Gain', destination: true }
  })
  t.assert(synth)
  t.assert(synth.osc1)
  t.assert(synth.osc1.out)
  t.assert(synth.osc1.osc)
  t.assert(synth.osc2)
  t.assert(synth.osc2.out)
  t.assert(synth.osc2.osc)
  t.assert(synth.out)
  t.end()
})
