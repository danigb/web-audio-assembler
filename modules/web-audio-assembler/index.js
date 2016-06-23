'use strict'
var nodes = require('./lib/audio-nodes')
var namespace = require('./lib/namespaced')

function init (plugins, noDefs) {
  plugins = plugins || []
  if (!noDefs) plugins = plugins.concat([ nodes ])

  return function assembler (desc) {
    if (arguments.length === 2) return assembler(arguments[1])(arguments[0])
    var graph = namespace(desc)
    return function (ac) {
      var nodes = {}
      plugins.forEach(function (fn) { fn(ac, nodes, graph) })
      return namespace.expand(nodes)
    }
  }
}

module.exports = { init: init, assemble: init(false, false) }
