/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var Assembler = require('..')

test('no plugins', function (t) {
  var ac = new AudioContext()
  var assemble = Assembler.init(false, true)
  var node = assemble(ac, { node: 'Gain' })
  t.deepEqual(node, { })
  t.end()
})

test('assembler', function (t) {
  var ac = new AudioContext()
  Assembler.assemble(ac, { node: 'Gain' })
  t.end()
})
