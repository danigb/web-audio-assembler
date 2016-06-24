/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var Assembler = require('..')

test.skip('schedule values', function (t) {
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
