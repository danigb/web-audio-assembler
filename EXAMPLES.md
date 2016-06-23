
## Variables

```js
var Synth = assembler({
  out: [ 'Gain', { connect: '$connect'}],
  osc: [ 'Oscillator', { frequency: '$freq', connect: 'out' }],
  midi: [ 'Midi', { connect: 'osc.frequency', note: '$note'}]
})
var synth = Synth(ac, { note: 'C4' }).connect(ac.destination)
```

## Alternative syntax 1

```js
var Synth = assembler({
  amp: ['Gain', { gain: 0.5, connect: '$connect' }],
  filter: ['BiquadFilter', { type: 'lowpass', frequency: '$freq', connect: 'amp' }],
  osc: ['Oscillator', { type: 'sine', frequency: '$freq', start: '$start' }]
})
var s = Synth(ac, { freq: 880 }).connect(ac.destination)

```


## 1. Simple node

```js
var gain = assembler(['Gain'])(ac)
var osc = assembler(['Oscillator', { frequemcy: 360 }])(ac)
```

## 2. Simple synth

```js
var Synth = assembler([{
  amp: ['Gain', { type: 'sawtooth', gain: 0.2, connect: '$connect' }],
  filter: [ 'BiquadFilter', { type: 'lowpass', frequency: 400, connect: 'amp' }],
  osc: [ 'Oscillator', { connect: 'filter' }]
}, { connect: 'destination' }])
```

## 3. Kick

```js
var Kick = assembler({
  out: ['Gain', { connect: '$connect' }],
  env: [ 'Contour', { duration: 0.01, attack: 0.01, decay: 0,
          sustain: 1, release: 0.1, connect: 'out' }],
  tone: [{
    out: [ 'Gain', { connect: '$connect' }],
    osc: [ 'Oscillator', { frequency: 54, connect: 'oscGain' }],
  }, { connect: 'env' }],
  noise: [{
    gain: [ 'Gain', { connect: '$connect' }],
    filter: [ 'BiquadFilter', { connect: 'gain', type: 'bandpass',
                                frequency: 2760, Q: 20 }],
    source: [ 'Noise', { duration: 1, loop: true, connect: 'filter' }]
  }, { connect: 'env' }]
})
```

# 4. Duo synth

```js
var osc = {
  amp: [ 'Gain', { gain: 0.4, connect: '$connect' }],
  filter: [ 'BiquadFilter', { type: 'lowpass', frequency: 2000, connect: 'amp' }],
  osc: [ 'Oscillator', { type: 'sawtooth', connect: 'filter' }]
}
```

**Option 1: node contains a graph**
```js
var Synth = assembler({
  amp: [ 'Gain', { gain: 0.8, connect: '$connect', destination: true }],
  voice1: [ osc, { 'osc.detune': -10, connect: 'amp' }],
  voice2: [ osc, { 'osc.detune': 10, connect: 'amp' }]
  midi: ['Midi', { connect: ['voice1.osc.frequency', 'voice2.osc.frequency'] }]
})
Synth(ac, { 'midi.note': 'C4' }).connect(ac.destination).start()
```

# 5. Reverb

```js
var reverb = {
  in: [ 'Gain', connect: ['dry', 'convolver'] }
  out: [ 'Gain', connect: '$connect' }
  dry: [ 'Gain', gain: 0.7, connect: 'out' },
  wet: [ 'Gain', gain: 0.3, connect: 'out' },
  convolver: [ 'Convolver', buffer: '$reverb', connect: 'wet' }
}
var synth = {
  amp: [ 'Gain', type: 'sawtooth', gain: 0.2, connect: '$connect' },
  filter: [ 'BiquadFilter', type: 'lowpass', frequency: 400, connect: 'amp' },
  osc: [ 'Oscillator', connect: 'filter' }
}
var Rack = assembler({
  synth: [synth, { connect: 'reverb.in' }]
  reverb: [reverb, { reverb: plate140, connect: '$connect'  }]
})
s = Rack(ac).connect(ac.destination)
```
