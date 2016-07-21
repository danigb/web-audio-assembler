(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var get = require('object-path-get')

module.exports = function (node, desc, props, parent) {
  var connect = props ? props.connect : null
  if (!connect) return
  var target = get(parent, connect)
  if (!target && connect === 'destination') target = node.context.destination
  if (target && node.connect) node.connect(target)
}

},{"object-path-get":8}],2:[function(require,module,exports){
var is = require('hi-typeof')
var isStr = is('string')

module.exports = function (node, nodeDesc, props, parent) {
  Object.keys(props).forEach(function (key) {
    var value = props[key]
    if (!isExport(value)) return
    if (key === 'connect') exportConnection(node, parent)
    else exportKey(node, parent, key, value)
  })
}

function exportKey (node, parent, key, value) {
  parent = parent || node
  parent[value.slice(1)] = node[key]
}

function exportConnection (node, parent) {
  if (!node.connect) return
  var _connect = node.connect
  parent = parent || node
  parent.connect = function (dest) {
    _connect.call(node, dest)
    return parent
  }
}

function isExport (value) {
  return isStr(value) && value[0] === '$'
}

},{"hi-typeof":6}],3:[function(require,module,exports){
var is = require('hi-typeof')
var get = require('object-path-get')
var mapValues = require('map-values')

var isArr = Array.isArray
var isObj = is('object')
var isStr = is('string')
var E = {}

var plugins = [
  require('./properties'),
  require('./connect'),
  require('./exports')
]

function descNode (desc) { return isArr(desc) ? desc[0] : desc }
function descProps (desc) { return isArr(desc) && desc[1] ? desc[1] : E }

function assembler (desc) {
  return function (ac) {
    var node = assemble(ac, desc)
    return node
  }
}

function assemble (ac, desc) {
  var node
  node = build(ac, desc)
  plugins.forEach(function (plugin) {
    apply(plugin, node, desc)
  })
  return node
}

function build (ac, desc) {
  var factory = descNode(desc)

  return isStr(factory) ? createNode(ac, factory)
    : isObj(factory) ? mapValues(factory, function (v) { return build(ac, v) })
    : null
}

function apply (fn, node, desc, parent) {
  var factory = descNode(desc)
  var props = descProps(desc)
  if (isObj(factory)) {
    Object.keys(factory).forEach(function (k) {
      apply(fn, node[k], get(factory, k), node)
    })
  }
  fn(node, factory, props, parent)
  return node
}

function createNode (ac, name) {
  var cons = 'create' + name
  return ac[cons]()
}

if (typeof module === 'object' && module.exports) module.exports = assembler
if (typeof window !== 'undefined') window.Assembler = assembler

},{"./connect":1,"./exports":2,"./properties":5,"hi-typeof":6,"map-values":7,"object-path-get":8}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){
var is = require('hi-typeof')
var nodes = require('./nodes')
var get = require('object-path-get')

var isStr = is('string')
var isNum = is('number')
var isDef = is('undefined', false)

module.exports = function (node, nodeDesc, props, parent) {
  if (isStr(nodeDesc)) {
    var spec = nodes.explain(nodeDesc + 'Node')
    if (spec) setNodeProperties(node, spec, props)
  } else {
    Object.keys(props).forEach(function (k) {
      var ndx = k.lastIndexOf('.')
      var location = k.slice(0, ndx)
      var prop = k.slice(ndx + 1)
      var target = get(node, location)
      var def = get(nodeDesc, location)[0]
      var value = props[k]
      setNodeProperty(target, prop, value, def)
    })
  }
}

function setNodeProperty (node, name, value, def) {
  if (!node[name]) return
  if (isDef(node[name].value)) node[name].value = value
  else node[name] = value
}

function setNodeProperties (node, spec, props) {
  Object.keys(spec).forEach(function (k) {
    var target = node[k]
    var value = props[k]
    if (!target || !value) return
    else if (isDef(target.value)) {
      if (isNum(value)) target.value = value
    } else if (node[k]) node[k] = value
  })
}

},{"./nodes":4,"hi-typeof":6,"object-path-get":8}],6:[function(require,module,exports){
'use strict'

module.exports = function (t, r) {
  var b = r === false
  return function (o) { return (typeof o === t) !== b }
}

},{}],7:[function(require,module,exports){
"use strict";

var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function(obj, map) {
	var result = {};
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			result[key] = map(obj[key], key, obj);
		}
	}
	return result;
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = exports = function (obj, path, defaultValue, delimiter) {
	var arr;
	var i;
	if (typeof path === 'string') {
		arr = path.split(delimiter || '.');
		for (i = 0; i < arr.length; i++) {
			if (obj && (obj.hasOwnProperty(arr[i]) || obj[arr[i]])) {
				obj = obj[arr[i]];
			} else {
				return defaultValue;
			}
		}
		return obj;
	} else {
		return defaultValue;
	}
};

},{}]},{},[3]);
