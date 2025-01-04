import { Environment, EnvironmentKind } from './environment'

export const globalEnvironment = new Environment(null)
globalEnvironment.add('array_push', EnvironmentKind.Function)
globalEnvironment.add('array', EnvironmentKind.Function)
globalEnvironment.add('ArrayIterator', EnvironmentKind.Class)
globalEnvironment.add('DomainException', EnvironmentKind.Class)
globalEnvironment.add('Traversable', EnvironmentKind.Class)
