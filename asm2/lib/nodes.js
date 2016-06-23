
function explain (name) {
  return NODES[name]
}

module.exports = { explain: explain }

var NODES = {
  GainNode: {
    gain: 'gain'
  },
  OscillatorNode: {
    detune: 'detune',
    frequency: 'frequency',
    type: 'oscillator-type',
    start: 'start',
    stop: 'stop',
    onended: 'onended'
  },
  BiquadFilterNode: {
    frequency: 'frequency',
    detune: 'detune',
    Q: 'q',
    gain: 'gain',
    type: 'filter-type'
  },
  DelayNode: {
    delayTime: 'delay-time'
  },
  ConvolverNode: {
    buffer: 'buffer',
    normalize: 'boolean'
  }
}
