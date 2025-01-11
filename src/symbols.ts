import { Type } from './types'
import { t } from './builder'

export enum SymbolKind {
  Variable = 1,
  ClosureVariable,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
  ClassConst,
  PhinRuntimeFunction,
}

// TODO test this file
// TODO so need to bind to actual nodes in the AST? then types resolve lazily AFTER this pass

export class Symbol<K extends SymbolKind = SymbolKind> {
  constructor(
    public readonly name: string,
    public readonly type: Type,
    public readonly kind: K,
  ) {}
  toString() {
    return `${SymbolKind[this.kind]} ${this.name}: ${this.type.constructor.name}`
  }
}

export interface SymbolTable<K extends SymbolKind = SymbolKind> {
  has(name: string): boolean
  get(name: string): Symbol<K> | null
  add(name: string, type: Type | null, kind?: K): void
}

type HoistedSymbolKind =
  | SymbolKind.Function
  | SymbolKind.Class
  | SymbolKind.PhinRuntimeFunction
type ClassSymbolKind =
  | SymbolKind.ClassProperty
  | SymbolKind.ClassMethod
  | SymbolKind.ClassConst

export class HoistedEnvironment implements SymbolTable<HoistedSymbolKind> {
  private readonly symbols = new Map<string, Symbol<HoistedSymbolKind>>()
  // constructor(initial?: { [key: string]: HoistedSymbolKind }) {
  //   if (initial) {
  //     for (let key of Object.keys(initial)) {
  //       this.add(key, initial[key])
  //     }
  //   }
  // }
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(name: string): Symbol<HoistedSymbolKind> | null {
    return this.symbols.get(name) ?? null
  }
  add(name: string, type: Type | null, kind: HoistedSymbolKind) {
    this.symbols.set(name, new Symbol(name, type ?? t.any(), kind))
  }
}

export class ClassEnvironment implements SymbolTable<ClassSymbolKind> {
  private readonly symbols = new Map<string, Symbol<ClassSymbolKind>>()
  // constructor(initial?: { [key: string]: ClassSymbolKind }) {
  //   if (initial) {
  //     for (let key of Object.keys(initial)) {
  //       this.add(key, initial[key])
  //     }
  //   }
  // }
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(name: string): Symbol<ClassSymbolKind> | null {
    return this.symbols.get(name) ?? null
  }
  add(name: string, type: Type | null, kind: ClassSymbolKind) {
    this.symbols.set(name, new Symbol(name, type ?? t.any(), kind))
  }
}

export class LocalEnvironment implements SymbolTable<SymbolKind.Variable> {
  private readonly symbols = new Map<string, Symbol<SymbolKind.Variable>>()
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(name: string): Symbol<SymbolKind.Variable> | null {
    return this.symbols.get(name) ?? null
  }
  add(name: string, type: Type | null) {
    this.symbols.set(
      name,
      new Symbol(name, type ?? t.any(), SymbolKind.Variable),
    )
  }
}

export class ClosureEnvironment implements SymbolTable {
  private readonly symbols = new Map<
    string,
    Symbol<SymbolKind.Variable | SymbolKind.ClosureVariable>
  >()
  constructor(
    private readonly enclosed: LocalEnvironment | ClosureEnvironment,
  ) {}
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(
    name: string,
  ): Symbol<SymbolKind.Variable | SymbolKind.ClosureVariable> | null {
    let symbol = this.symbols.get(name)
    if (symbol) return symbol
    let enclosed = this.enclosed.get(name)
    if (enclosed)
      return new Symbol(name, enclosed.type, SymbolKind.ClosureVariable)
    return null
  }
  add(name: string, type: Type | null) {
    this.symbols.set(
      name,
      new Symbol(name, type ?? t.any(), SymbolKind.Variable),
    )
  }
}
