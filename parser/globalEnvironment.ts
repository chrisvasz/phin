import { EnvironmentKind, HoistedEnvironment } from './environment'

export const builtinEnvironment = new HoistedEnvironment()
builtinEnvironment.add('array_push', EnvironmentKind.Function)
builtinEnvironment.add('array', EnvironmentKind.Function)
builtinEnvironment.add('ArrayIterator', EnvironmentKind.Class)
builtinEnvironment.add('DomainException', EnvironmentKind.Class)
builtinEnvironment.add('Traversable', EnvironmentKind.Class)
