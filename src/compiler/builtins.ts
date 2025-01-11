import {} from '../symbols'
import * as n from '../nodes'
import compile from '.'
import { t } from '../builder'

export const runtime: { [key: string]: () => n.Node } = {}

/*

export const builtins = new HoistedEnvironment()

// TODO better types

for (let key of Object.keys(runtime)) {
  builtins.add(key, t.any(), SymbolKind.PhinRuntimeFunction)
}

builtins.add('array_map', t.any(), SymbolKind.Function)
builtins.add('array_push', t.any(), SymbolKind.Function)
builtins.add('array_sum', t.any(), SymbolKind.Function)
builtins.add('array', t.any(), SymbolKind.Function)
builtins.add('count', t.any(), SymbolKind.Function)

builtins.add('ArrayIterator', t.any(), SymbolKind.Class)
builtins.add('DomainException', t.any(), SymbolKind.Class)
builtins.add('Traversable', t.any(), SymbolKind.Class)
builtins.add('Exception', t.any(), SymbolKind.Class)

function map() {
  return compile(
    `fun map(transform) => fun(arr: array) => array_map(transform, arr)`,
  ).statements[0] as n.FunctionDeclaration
}

function sum() {
  return compile(`fun sum(arr: array) => array_sum(arr)`)
    .statements[0] as n.FunctionDeclaration
}

*/
