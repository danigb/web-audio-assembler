/* global AudioContext */
require('web-audio-test-api')
var test = require('tape')
var assembler = require('..')

test('export connect', function (t) {
  var ac = new AudioContext()
  var nodes = assembler(['Gain', { connect: '$connect' }])(ac)
  t.assert(nodes)
  t.end()
})
