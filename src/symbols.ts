import * as n from './nodes'

// TODO test this file

type HoistedNode = n.FunctionDeclaration | n.ClassDeclaration
// | n.PhinRuntimeFunction // TODO
export type ClassNode =
  | n.ClassDeclaration
  | n.ClassProperty
  | n.ClassAbstractMethod
  | n.ClassMethod
  | n.ClassConst
export type LocalNode =
  | n.VarDeclaration
  | n.Param
  | n.ForeachVariable
  | n.DestructuringElement

export abstract class Symbols<T extends n.Node = n.Node> {
  protected readonly symbols = new Map<string, T>()
  has(name: string): boolean {
    return this.get(name) !== null
  }
  get(name: string): T | null {
    return this.symbols.get(name) ?? null
  }
  add(name: string, node: T) {
    this.symbols.set(name, node)
  }
}

export class HoistedSymbols extends Symbols<HoistedNode> {}
export class ClassSymbols extends Symbols<ClassNode> {}
export class LocalSymbols extends Symbols<LocalNode> {}
export class TestSymbols extends Symbols<n.Node> {}
export class ClosureSymbols extends Symbols<LocalNode> {
  constructor(private readonly enclosed: LocalSymbols | ClosureSymbols) {
    super()
  }
} // TODO implement me for PHP use clause
