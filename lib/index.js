
var assemble = require('./assemble')
var audioNodes = require('./audio-nodes')
var extraNodes = require('./extra-nodes')

function assembler (desc) {
  return function (ac) {
    return assemble(desc, [ audioNodes, extraNodes ], ac)
  }
}

module.exports = { assemble: assembler }
