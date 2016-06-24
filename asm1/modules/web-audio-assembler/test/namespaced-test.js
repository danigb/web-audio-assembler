var test = require('tape')
var ns = require('../lib/namespaced')

test('flatten namespaces', function (t) {
  t.deepEqual(ns({a: 2}), { null: { a: 2 } })
  t.deepEqual(ns({a: {b: 2}}),
    { a: { b: 2 } })
  t.deepEqual(ns({n: {a: {v: 1}, b: {v: 2}}}),
    {'n.a': {v: 1}, 'n.b': {v: 2}})
  t.end()
})

test('expand namspace', function (t) {
  t.deepEqual(ns.expand({null: { v: 1 }}), {v: 1})
  t.deepEqual(ns.expand({ 'a.b': {v: 1} }),
    {a: {b: {v: 1}}})
  t.deepEqual(ns.expand({ 'a.b': {v: 1}, 'a.c': {v: 2} }),
    {a: {b: {v: 1}, c: {v: 2}}})
  t.end()
})
