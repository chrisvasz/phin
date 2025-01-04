export enum EnvironmentKind {
  Variable = 1,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
  ClassConst,
}

export interface Environment_<T extends EnvironmentKind = EnvironmentKind> {
  has(name: string): boolean
  get(name: string): EnvironmentKind | null
  add(value: string, kind: T): void
}

// TODO environment types: builtin, hoisted, class, local

type HoistedEnvironmentKind = EnvironmentKind.Function | EnvironmentKind.Class
type ClassEnvironmentKind =
  | EnvironmentKind.ClassProperty
  | EnvironmentKind.ClassMethod
  | EnvironmentKind.ClassConst

export class HoistedEnvironment
  implements Environment_<HoistedEnvironmentKind>
{
  private readonly values = new Map<string, HoistedEnvironmentKind>()

  constructor(
    private readonly enclosing: Environment_ | null,
    initial?: { [key: string]: HoistedEnvironmentKind },
  ) {
    if (initial) {
      for (let key of Object.keys(initial)) {
        this.add(key, initial[key])
      }
    }
  }

  has(name: string): boolean {
    return this.get(name) !== null
  }

  get(name: string): EnvironmentKind | null {
    return this.values.get(name) ?? this.enclosing?.get(name) ?? null
  }

  add(value: string, kind: HoistedEnvironmentKind) {
    this.values.set(value, kind)
  }
}

export class ClassEnvironment implements Environment_<ClassEnvironmentKind> {
  private readonly values = new Map<string, ClassEnvironmentKind>()

  constructor(
    private readonly enclosing: Environment_ | null,
    initial?: { [key: string]: ClassEnvironmentKind },
  ) {
    if (initial) {
      for (let key of Object.keys(initial)) {
        this.add(key, initial[key])
      }
    }
  }

  has(name: string): boolean {
    return this.get(name) !== null
  }

  get(name: string): EnvironmentKind | null {
    return this.values.get(name) ?? this.enclosing?.get(name) ?? null
  }

  add(value: string, kind: ClassEnvironmentKind) {
    this.values.set(value, kind)
  }
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

  has(name: string): boolean {
    return this.get(name) !== null
  }

  get(name: string): EnvironmentKind | null {
    return this.values.get(name) ?? this.enclosing?.getNonVariable(name) ?? null
  }

  add(value: string, kind: EnvironmentKind) {
    this.values.set(value, kind)
  }
}
