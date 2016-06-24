var test = require('tape')
var spec = require('..').init()

test('explain descriptors', function (t) {
  t.deepEqual(spec.explain('gain'),
    { defaultValue: 1, max: Infinity, min: -Infinity, type: 'a-rate' })
  t.deepEqual(spec.explain('detune'),
    { type: 'a-rate', units: 'Cents', defaultValue: 0, max: Infinity, min: -Infinity })
  t.deepEqual(spec.explain('frequency'),
    { type: 'a-rate', defaultValue: 440, max: 40000, min: 0, units: 'Hz' })
  t.deepEqual(spec.explain('q'),
    { defaultValue: 1, max: 1000, min: 0.0001, type: 'a-rate' })
  t.deepEqual(spec.explain('delay-time'),
    { type: 'a-rate', units: 'Seconds', defaultValue: 0, max: Infinity, min: 0 })

  t.deepEqual(spec.explain('oscillator-type'),
    { defaultValue: 'sine', type: 'select', values: [ 'sine', 'square',
      'sawtooth', 'triangle', 'custom' ] })
  t.deepEqual(spec.explain('filter-type'),
    { type: 'select', defaultValue: 'lowpass', values: [ 'lowpass', 'highpass',
      'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass' ] })

  t.deepEqual(spec.explain('onended'),
    { type: 'event', value: 'ended' })
  t.deepEqual(spec.explain('start'),
    { type: 'trigger', value: 'start' })
  t.deepEqual(spec.explain('stop'),
    { type: 'trigger', value: 'stop' })
  t.end()
})

test('GainNode descriptor', function (t) {
  var desc = spec.explain('GainNode')
  t.assert(desc)
  t.deepEqual(desc.gain, spec.explain('gain'))
  t.end()
})

test('OscillatorNode descriptor', function (t) {
  var desc = spec.explain('OscillatorNode')
  t.assert(desc)
  t.deepEqual(desc.detune, spec.explain('detune'))
  t.deepEqual(desc.frequency, spec.explain('frequency'))
  t.deepEqual(desc.onended, spec.explain('onended'))
  t.deepEqual(desc.type, spec.explain('oscillator-type'))
  t.end()
})

test('BiquadFilterNode descriptor', function (t) {
  var desc = spec.explain('BiquadFilterNode')
  t.assert(desc)
  t.deepEqual(desc.detune, spec.explain('detune'))
  t.deepEqual(desc.frequency, spec.explain('frequency'))
  t.deepEqual(desc.gain, spec.explain('gain'))
  t.deepEqual(desc.Q, spec.explain('q'))
  t.deepEqual(desc.type, spec.explain('filter-type'))
  t.end()
})

test('DelayNode descriptor', function (t) {
  var desc = spec.explain('DelayNode')
  t.assert(desc)
  t.deepEqual(desc.delayTime, spec.explain('delay-time'))
  t.end()
})

test('ConvolverNode descriptor', function (t) {
  var desc = spec.explain('ConvolverNode')
  t.assert(desc)
  t.deepEqual(desc.buffer, spec.explain('buffer'))
  t.end()
})
