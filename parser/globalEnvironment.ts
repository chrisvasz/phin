import { EnvironmentKind, HoistedEnvironment } from './environment'
import * as n from '../nodes'
import compile from '../compiler'

export const builtinEnvironment = new HoistedEnvironment()
export const runtime: { [key: string]: () => n.Node } = {
  map,
  sum,
}

for (let key of Object.keys(runtime)) {
  builtinEnvironment.add(key, EnvironmentKind.PhinRuntimeFunction)
}

builtinEnvironment.add('array_map', EnvironmentKind.Function)
builtinEnvironment.add('array_push', EnvironmentKind.Function)
builtinEnvironment.add('array_sum', EnvironmentKind.Function)
builtinEnvironment.add('array', EnvironmentKind.Function)

builtinEnvironment.add('ArrayIterator', EnvironmentKind.Class)
builtinEnvironment.add('DomainException', EnvironmentKind.Class)
builtinEnvironment.add('Traversable', EnvironmentKind.Class)
builtinEnvironment.add('Exception', EnvironmentKind.Class)

function map() {
  return compile(
    `fun map(transform) => fun(arr: array) => array_map(transform, arr)`,
  )
}

function sum() {
  return compile(`fun sum(arr: array) => array_sum(arr)`)
}
