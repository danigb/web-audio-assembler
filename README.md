# web-audio-assembler

**This is not even alpha software. It's an exploration of an idea**

The aim of this project is answer the question: how to convert the highly imperative web audio api into something more compatible with a functional programming approach? In fact, the first purpose of this project is to access Web Audio API from Elm lang.

The objectives are:

- Create and connect audio nodes using a declarative approach
- Be able to update and schedule updates of those objects
- Allow other software (for example, audio user interfaces) to discover properties and capabilities of generated nodes

## How-to

The idea it's old and popular: instead of use the API, create an object with the description of what you want and let web-audio-assembler to do the work.


### Create audio nodes

**Create simple nodes**

```js
var ac = new AudioContext()
var waas = require('web-audio-assembler')

var Osc = waas.assemble({
  node: 'oscillator',
  type: 'sine',
  frequency: 400
})
Osc(ac).start()
```

**Create more complex node graphs**

```js
var Synth = waas.assemble({
  name: 'microsynth',
  amp: {
    node: 'gain'
  },
  filter: {
    node: 'filter',
    type: 'lowpass',
    frequency: '500',
    connectTo: 'amp'
  },
  osc: {
    node: 'oscillator',
    type: 'sine'
    connectTo: 'filter'
  }
})
var synth = Synth(ac)
synth.amp.connect(ac.destination)
synth.osc.start(ac.currentTime)
```

### Schedule updates

```js
waas.schedule(synth, [
  { type: 'start', name: 'osc', time: 0 },
  { type: 'value', name: 'filter.frequency', value: 400, time: 1 }
])
```

## References, links and related projects

- Web Audio API, of course: https://www.w3.org/TR/webaudio/
- clojure.spec (I'm thinking in a kind of spec of web audio)
- A standardized framework for building and including Web Audio API instrument/effect "patches": https://github.com/h5bp/lazyweb-requests/issues/82
- Flocking uses a similar idea to build synths: https://github.com/colinbdclark/flocking

## License

MIT License
