var is = require('hi-typeof')

// Utility
var isNum = is('number')

module.exports = function () {
  return function (name) {
    return TYPES[name]
  }
}

function setFromList (list) {
  return function (node, name, value) {
    if (list.indexOf(value) === -1) {
      throw Error('Not valid "' + name + '" value: ' + value)
    }
    node[name] = value
  }
}

var TYPES = {
  'a-rate': {
    set: function (node, name, value) {
      if (!isNum(value)) throw Error('An a-rate value for ' + name + ' must be a number, but was: ' + value)
      node[name].value = value
    }
  },
  'oscillator-type': {
    set: setFromList(['sine', 'square', 'sawtooth', 'triangle', 'custom'])
  },
  'filter-type': {
    set: setFromList(['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'])
  }
}
