# web-audio-assembler [![npm](https://img.shields.io/npm/v/web-audio-assembler.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-assembler)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/web-audio-assembler.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-assembler)

**This is not even alpha software. It's an exploration of an idea**

The aim of this project is answer the question: how to convert the highly imperative web audio api into something more compatible with a functional programming approach? In fact, the first purpose of this project is to access Web Audio API from Elm lang.

You can see the [Live Examples](https://danigb.github.io/web-audio-assembler) or read the [generated API documentation](https://github.com/danigb/web-audio-assembler/blob/master/API.md)

The idea it's old and popular: instead of use the API, create an object with the description of what you want and let `web-audio-assembler` to do the work.

Requirements:

- The node graph descriptor must be JSON serializable
- Create Web Audio API modules delcaratively
- Connect modules to modules or audio params
- Update and schedule updates of those node graphs
- Allow other software (for example, audio user interfaces) to discover properties and capabilities of node graph

## How-to

### Assemble audio nodes

**Create simple nodes**

Use the `assemble` function to create a function that returns a node:

```js
var ac = new AudioContext()
var Assembler = require('web-audio-assembler')

var Osc = Assembler.assemble({
  node: 'oscillator',
  type: 'sine',
  frequency: 400,
  connect: '$context'
})
var osc = Osc(ac)
osc.start()
```

**Create more complex node graphs**

You can create a complex node graph by using an object. Also you can use the `connect` property to connect one node to the other:

```js
var Synth = Assembler.assemble({
  name: 'microsynth',
  amp: {
    node: 'gain',
    connect: '$context'
  },
  filter: {
    node: 'filter',
    type: 'lowpass',
    frequency: '500',
    connect: 'amp'
  },
  osc: {
    node: 'oscillator',
    type: 'sine'
    connect: 'filter'
  }
})
var synth = Synth(ac)
synth.osc.start(ac.currentTime)
// or
Assembler.start(synth, ac.currentTime) // start all startable nodes (oscillators, audio sources, envelopes)
Assembler.stop(synth, ac.currentTime)  // stop all stoppable nodes
Assembler.dispoase(synth) // dispose all nodes
```

### Schedule updates

There's a way to schedule updates in the node. You pass an array with update objects with the form `{ target: <node.path>, time: <relative time in secs>, ...}`:

```js
Assembler.schedule(synth, ac.currentTime, [
  { target: 'filter.frequency', value: 400, time: 0 },
  { target: 'osc', trigger: 'start', time: 0 },
  { target: 'filter.frequency', value: 400, time: 1 }
])
```

Notice the `time` value of the update events are relative to the time passed to the `schedule` function.

### TODO

- Currently only Oscillator, Gain, BiquadFilter and Delay nodes are implemented.
- Use custom nodes generators (envelopes, for example)
- Combine node graphs
- Describe node graphs (to generate synth UIs for example)
- Add yours...

## Run tests and examples

Clone this repository and run `npm install && npm test`. You can open the .html files of the `examples` directory directly (no server required).

## References, links and related projects

- Web Audio API, of course: https://www.w3.org/TR/webaudio/
- clojure.spec (I'm thinking in a kind of spec of web audio)
- A standardized framework for building and including Web Audio API instrument/effect "patches": https://github.com/h5bp/lazyweb-requests/issues/82
- Flocking uses a similar approach to build synths: https://github.com/colinbdclark/flocking
- https://github.com/charlieroberts/genish.js

## License

MIT License
