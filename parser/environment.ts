export enum EnvironmentKind {
  Variable = 1,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
  ClassConst,
}

export interface Environment<T extends EnvironmentKind = EnvironmentKind> {
  has(name: string): boolean
  get(name: string): EnvironmentKind | null
  add(value: string, kind: T): void
}

type HoistedEnvironmentKind = EnvironmentKind.Function | EnvironmentKind.Class
type ClassEnvironmentKind =
  | EnvironmentKind.ClassProperty
  | EnvironmentKind.ClassMethod
  | EnvironmentKind.ClassConst

export class HoistedEnvironment implements Environment<HoistedEnvironmentKind> {
  private readonly values = new Map<string, HoistedEnvironmentKind>()
  constructor(
    private readonly enclosing: Environment | null,
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

export class ClassEnvironment implements Environment<ClassEnvironmentKind> {
  private readonly values = new Map<string, ClassEnvironmentKind>()
  constructor(
    private readonly enclosing: Environment | null,
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

export class LocalEnvironment implements Environment<EnvironmentKind.Variable> {
  private readonly values = new Map<string, EnvironmentKind.Variable>()
  constructor(
    private readonly enclosing: Environment | null,
    initial?: { [key: string]: EnvironmentKind.Variable },
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
  add(value: string, kind: EnvironmentKind.Variable) {
    this.values.set(value, kind)
  }
}
