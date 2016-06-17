# web-audio-assembler

**This is not even alpha software. It's an exploration of an idea**

The aim of this project is answer the question: how to convert the highly imperative web audio api into something more compatible with a functional programming approach? In fact, the first purpose of this project is to access Web Audio API from Elm lang.

Requirements:

- The node graph definition must be JSON serializable
- Create Web Audio API modules delcaratively
- Connect modules to modules or audio params
- Update and schedule updates of those node graphs
- Allow other software (for example, audio user interfaces) to discover properties and capabilities of node graph

You can see the [Live Examples](https://danigb.github.io/web-audio-assembler)

## How-to

The idea it's old and popular: instead of use the API, create an object with the description of what you want and let web-audio-assembler to do the work.

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
synth.amp.connect(ac.destination)
synth.osc.start(ac.currentTime)
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

### Describe nodes and node graphs

Sometimes it's usefull to know the capabilities of a node or a node graph. The `describe` function does just that.


## References, links and related projects

- Web Audio API, of course: https://www.w3.org/TR/webaudio/
- clojure.spec (I'm thinking in a kind of spec of web audio)
- A standardized framework for building and including Web Audio API instrument/effect "patches": https://github.com/h5bp/lazyweb-requests/issues/82
- Flocking uses a similar idea to build synths: https://github.com/colinbdclark/flocking

## License

MIT License
