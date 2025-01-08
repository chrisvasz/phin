export enum EnvironmentKind {
  Variable = 1,
  ClosureVariable,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
  ClassConst,
}

export interface Environment<T extends EnvironmentKind = EnvironmentKind> {
  has(name: string): boolean
  get(name: string): EnvironmentKind | null
  add(value: string, kind?: T): void
}

type HoistedEnvironmentKind = EnvironmentKind.Function | EnvironmentKind.Class
type ClassEnvironmentKind =
  | EnvironmentKind.ClassProperty
  | EnvironmentKind.ClassMethod
  | EnvironmentKind.ClassConst

export class HoistedEnvironment implements Environment<HoistedEnvironmentKind> {
  private readonly values = new Map<string, HoistedEnvironmentKind>()
  constructor(initial?: { [key: string]: HoistedEnvironmentKind }) {
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
    return this.values.get(name) ?? null
  }
  add(value: string, kind: HoistedEnvironmentKind) {
    this.values.set(value, kind)
  }
}

export class ClassEnvironment implements Environment<ClassEnvironmentKind> {
  private readonly values = new Map<string, ClassEnvironmentKind>()
  constructor(initial?: { [key: string]: ClassEnvironmentKind }) {
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
    return this.values.get(name) ?? null
  }
  add(value: string, kind: ClassEnvironmentKind) {
    this.values.set(value, kind)
  }
}

export class LocalEnvironment implements Environment<EnvironmentKind.Variable> {
  private readonly values = new Set<string>()
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(name: string): EnvironmentKind | null {
    return this.values.has(name) ? EnvironmentKind.Variable : null
  }
  add(value: string) {
    this.values.add(value)
  }
}

export class ClosureEnvironment implements Environment {
  private readonly values = new Set<string>()
  constructor(
    private readonly enclosed: LocalEnvironment | ClosureEnvironment,
  ) {}
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(name: string): EnvironmentKind | null {
    if (this.values.has(name)) return EnvironmentKind.Variable
    if (this.enclosed.has(name)) return EnvironmentKind.ClosureVariable
    return null
  }
  add(value: string) {
    this.values.add(value)
  }
}
