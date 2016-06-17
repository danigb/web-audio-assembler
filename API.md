## Functions

<dl>
<dt><a href="#assemble">assemble(obj, ac)</a> ⇒ <code>function</code> | <code>AudioNode</code></dt>
<dd><p>Assemble a node or node graph object</p>
</dd>
<dt><a href="#schedule">schedule(graph, when, events)</a></dt>
<dd><p>Schedule update events.</p>
</dd>
<dt><a href="#start">start(graph, when)</a></dt>
<dd><p>Start a node or graph</p>
</dd>
<dt><a href="#stop">stop(graph, when)</a></dt>
<dd><p>Stop a node or graph of nodes</p>
</dd>
<dt><a href="#disconnect">disconnect(graph, when)</a></dt>
<dd><p>Disconnect a node or graph of nodes</p>
</dd>
</dl>

<a name="assemble"></a>

## assemble(obj, ac) ⇒ <code>function</code> &#124; <code>AudioNode</code>
Assemble a node or node graph object

**Kind**: global function  
**Returns**: <code>function</code> &#124; <code>AudioNode</code> - a function that creates the node or node graph
or the node graph if AudioContext is provided  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the node or node graph description |
| ac | <code>AudioContext</code> | (Optional) the audio context |

**Example**  
```js
var Assembler = require('web-audio-assembler')
// create a node generator function
 + var osc = Assembler.assemble({ node: 'Oscillator' })
var ac = new AudioContext()
osc(ac).start()
// create the node directly
Assembler.assemble({ node: 'Oscillator', frequency: 880 }, ac).start()
```
<a name="schedule"></a>

## schedule(graph, when, events)
Schedule update events.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>AudioNode</code> &#124; <code>Object</code> | the node or node graph to schedule to |
| when | <code>Float</code> | the time to start the schedule |
| events | <code>Array</code> | the list of events |

<a name="start"></a>

## start(graph, when)
Start a node or graph

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>AudioNode</code> &#124; <code>Object</code> | the node or graph of nodes |
| when | <code>Float</code> | when to stop the nodes |

<a name="stop"></a>

## stop(graph, when)
Stop a node or graph of nodes

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>AudioNode</code> &#124; <code>Object</code> | the node or graph of nodes |
| when | <code>Float</code> | when to stop the nodes |

<a name="disconnect"></a>

## disconnect(graph, when)
Disconnect a node or graph of nodes

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>AudioNode</code> &#124; <code>Object</code> | the node or graph of nodes |
| when | <code>Float</code> | when to stop the nodes |

