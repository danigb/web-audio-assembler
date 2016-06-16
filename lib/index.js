
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
