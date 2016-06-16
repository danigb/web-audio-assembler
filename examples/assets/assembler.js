(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

function assemble (desc) {
  desc = desc || {}
  var ass = ASSEMBLERS[desc.node]
  if (!ass) return null
  return function (ac) {
    var node = ass.assemble(ac, Object.assign({}, ass.defaults, desc))
    if (desc.connect === true) node.connect(ac.destination)
    return node
  }
}

var ASSEMBLERS = {
  oscillator: {
    assemble: function (ac, desc) {
      var node = ac.createOscillator()
      node.type = desc.type
      node.frequency.value = desc.frequency
      return node
    },
    defaults: {
      type: 'square',
      frequency: 440
    }
  }
}

var Assembler = { assemble: assemble }

if (typeof module === 'object' && module.exports) module.exports = Assembler
if (typeof window !== 'undefined') window.Assembler = Assembler

},{}]},{},[1]);
