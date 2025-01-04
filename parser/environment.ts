import { Node } from './nodes'
import * as Nodes from './nodes'

export enum EnvironmentKind {
  Variable = 1,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
  ClassConst,
}

// TODO performance
export class Environment {
  private readonly values = new Map<string, EnvironmentKind>()

  constructor(
    public readonly enclosing: Environment | null,
    initial?: { [key: string]: EnvironmentKind },
  ) {
    if (initial) {
      for (let key of Object.keys(initial)) {
        this.add(key, initial[key])
      }
    }
  }

  // In PHP, functions do not inherit variables from the parent scope
  private getNonVariable(name: string): EnvironmentKind | null {
    let local = this.values.get(name)
    if (local && local !== EnvironmentKind.Variable) return local
    return this.enclosing?.getNonVariable(name) ?? null
  }

  get(name: string): EnvironmentKind | null {
    return this.values.get(name) ?? this.enclosing?.getNonVariable(name) ?? null
  }

  add(value: string, kind: EnvironmentKind) {
    this.values.set(value, kind)
  }
}
