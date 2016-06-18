/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var Assembler = require('..')

test('create noise', function (t) {
  var ac = new AudioContext()
  var g = Assembler.assemble({ node: 'Noise' })
  t.assert(g)
  t.assert(g(ac))
  t.assert(g(ac).duration, 1)
  t.end()
})
