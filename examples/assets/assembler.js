(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function oneOf (list) {
  return function (node, name, value) {
    if (list.indexOf(value) === -1) {
      throw Error('Not valid "' + name + '" value: ' + value)
    }
    node[name] = value
  }
}

var TYPES = {
  'a-rate': function (node, name, value) {
    node[name].value = value
  },
  'oscillator-type': oneOf(['sine', 'square', 'sawtooth', 'triangle', 'custom']),
  'filter-type': oneOf(['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'])
}

var NODES = {
  gain: {
    '_name': 'Gain',
    gain: 'a-rate'
  },
  oscillator: {
    '_name': 'Oscillator',
    frequency: 'a-rate',
    detune: 'a-rate',
    type: 'oscillator-type'
  },
  filter: {
    '_name': 'BiquadFilter',
    frequency: 'a-rate',
    detune: 'a-rate',
    Q: 'a-rate',
    gain: 'a-rate',
    type: 'filter-type'
  }
}

function assemble (obj) {
  return function (ac) {
    var n = node(ac, obj) || Object.keys(obj).reduce(function (n, k) {
      n[k] = node(ac, obj[k])
      return n
    }, {})
    makeConnections(ac, n, obj, n)
    return n
  }
}

function makeConnections (ac, node, obj, ctx) {
  if (!node) return
  if (obj.connect) {
    if (obj.connect === '$context') node.connect(ac.destination)
    else {
      var dest = ctx[obj.connect]
      if (dest) node.connect(dest)
    }
  } else {
    Object.keys(node).forEach(function (k) {
      makeConnections(ac, node[k], obj[k], ctx)
    })
  }
}

function node (ac, obj) {
  var desc = NODES[obj.node]
  if (!desc) return null
  var node = ac['create' + desc['_name']].bind(ac)()
  Object.keys(obj).forEach(function (k) {
    var setValue = TYPES[desc[k]]
    if (setValue) setValue(node, k, obj[k])
  })
  return node
}

var Assembler = { assemble: assemble }

if (typeof module === 'object' && module.exports) module.exports = Assembler
if (typeof window !== 'undefined') window.Assembler = Assembler

},{}]},{},[1]);
