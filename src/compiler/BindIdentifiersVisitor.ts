import {
  LocalSymbols,
  ClosureSymbols,
  LocalNode,
  HoistedSymbols,
  Symbols,
} from '../symbols'
import * as n from '../nodes'
import ParseError from '../parser/ParseError'
import VoidVisitor from './VoidVisitor'

export class UndeclaredIdentifierError extends ParseError {
  override name = 'UndeclaredIdentifierError'
  constructor(name: string) {
    super(`Undeclared identifier: ${name}`)
  }
}

export default class BindIdentifiersVisitor extends VoidVisitor {
  private symbols: SymbolTables
  private currentFunctionExpression: n.FunctionExpression | null = null

  constructor(globals: Symbols = new HoistedSymbols()) {
    super()
    this.symbols = new SymbolTables(globals)
  }

  visit(node: n.Program): void {
    this.symbols.wrap(node.symbols, () => node.accept(this))
  }

  override visitProgram(node: n.Program): void {
    let symbols = new LocalSymbols()
    this.symbols.wrap(symbols, () => super.visitProgram(node))
  }

  // TODO consider scoping rules here... can it access locals from the enclosing scope?
  override visitClassDeclaration(node: n.ClassDeclaration): void {
    this.symbols.wrap(node.symbols, () => super.visitClassDeclaration(node))
  }

  override visitClassMethod(node: n.ClassMethod): void {
    let symbols = new LocalSymbols()
    node.params.forEach((p) => symbols.add(p.name, p))
    this.symbols.wrap(symbols, () => super.visitClassMethod(node))
  }

  // TODO wrap class init blocks in env with class params
  // TODO catch clauses
  // TODO for loops

  override visitDestructuring(node: n.Destructuring): void {
    super.visitDestructuring(node)
    node.elements.forEach((element) => {
      if (element) {
        this.symbols.addLocal(element.value, element)
      }
    })
  }

  override visitForeachVariable(node: n.ForeachVariable): void {
    super.visitForeachVariable(node)
    this.symbols.addLocal(node.name, node)
  }

  override visitFunctionDeclaration(node: n.FunctionDeclaration): void {
    let symbols = new LocalSymbols()
    node.params.forEach((p) => symbols.add(p.name, p))
    this.symbols.wrap(symbols, () => super.visitFunctionDeclaration(node))
  }

  // TODO comment me
  // TODO what about doubly-embedded function expressions?
  // TODO will this break if we try to create a class var that is a function expression?
  override visitFunctionExpression(node: n.FunctionExpression): void {
    let symbols = new ClosureSymbols(this.symbols.locals())
    node.params.forEach((p) => symbols.add(p.name, p))
    let prev = this.currentFunctionExpression
    this.currentFunctionExpression = node
    this.symbols.wrap(symbols, () => super.visitFunctionExpression(node))
    this.currentFunctionExpression = prev
  }

  override visitIdentifier(node: n.Identifier): void {
    let name = node.name
    let resolvedNode = this.symbols.resolve(name)
    if (resolvedNode == null) throw new UndeclaredIdentifierError(name)
    node.bind(resolvedNode)
    // TODO
    // if (symbol.kind === SymbolKind.ClosureVariable) {
    //   this.currentFunctionExpression?.addClosureVariable(name)
    // }
  }

  override visitVarDeclaration(node: n.VarDeclaration): void {
    super.visitVarDeclaration(node)
    this.symbols.addLocal(node.name, node)
  }
}

// TODO rename me, own file
class SymbolTables {
  private tables: Symbols[] = []

  constructor(outer: Symbols) {
    this.tables.push(outer)
  }

  private peek(): Symbols {
    return this.tables[this.tables.length - 1]
  }

  resolve(identifier: string): n.Node | null {
    for (let i = this.tables.length - 1; i >= 0; i--) {
      let table = this.tables[i]
      let node = table.get(identifier)
      if (node != null) return node
    }
    return null
  }

  locals(): LocalSymbols | ClosureSymbols {
    let table = this.peek()
    if (!(table instanceof LocalSymbols)) {
      if (!(table instanceof ClosureSymbols)) {
        throw new Error('Expected local symbols')
      }
    }
    return table
  }

  // In PHP, functions can't access variables from the enclosing scope, with one exception: a function expression explicitly marks enclosed variables in a `use` clause. The function expression scenario is handled specifically elsewhere.
  wrap(table: Symbols, fn: () => void): void {
    let prev = this.peek()
    this.tables.push(table)
    fn()
    this.tables.pop()
    this.tables.push(prev)
  }

  addLocal(name: string, node: LocalNode): void {
    this.locals().add(name, node)
  }
}
