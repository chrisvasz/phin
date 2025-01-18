import VoidVisitor from './VoidVisitor'
import * as n from '../nodes'
import * as types from '../types'
import { t } from '../builder'
import { Type } from '../types'
import { HoistedSymbols } from '../symbols'

export class TypeCheckError extends Error {
  override name: string = 'TypeCheckError'
}

export class TypeMismatch extends TypeCheckError {
  override name: string = 'TypeMismatch'
  constructor(
    public expected: Type,
    public actual: Type,
  ) {
    super(`Type error: ${actual} is not assignable to ${expected}`)
  }
}

function check(expected: Type, actual: Type) {
  if (!expected.contains(actual)) {
    throw new TypeMismatch(expected, actual)
  }
}

// https://jaked.org/blog/2021-09-07-Reconstructing-TypeScript-part-0

export default class TypeCheckVisitor extends VoidVisitor {
  private readonly symbols: HoistedSymbols

  constructor(private readonly program: n.Program) {
    super()
    this.symbols = program.symbols
  }

  visit(): void {
    this.program.accept(this)
  }

  override visitArrayAccess(node: n.ArrayAccess): void {
    super.visitArrayAccess(node)
    let array = node.left
    if (array.type instanceof types.Array) {
      node.type = array.type.type
    } else {
      throw new TypeCheckError('Cannot index non-array')
    }
  }

  override visitArrayElement(node: n.ArrayElement): void {
    super.visitArrayElement(node)
    node.type = node.value.type!
  }

  override visitArrayLiteral(node: n.ArrayLiteral): void {
    super.visitArrayLiteral(node)
    node.type = t.array(t.union(...node.elements.map((e) => e.type!)))
  }

  override visitAssign(node: n.Assign): void {
    super.visitAssign(node)
    check(node.left.type!, node.right.type!)
    node.type = node.right.type!
  }

  override visitBinary(node: n.Binary): void {
    super.visitBinary(node)
    if (node.operator === '==') node.type = t.bool()
    else if (node.operator === '!=') node.type = t.bool()
    else if (node.operator === '===') node.type = t.bool()
    else if (node.operator === '!==') node.type = t.bool()
    else if (node.operator === '<') node.type = t.bool()
    else if (node.operator === '<=') node.type = t.bool()
    else if (node.operator === '>') node.type = t.bool()
    else if (node.operator === '>=') node.type = t.bool()
    else if (node.operator === '&&') node.type = t.bool()
    else if (node.operator === '||') node.type = t.bool()
    else if (node.operator === '+.') node.type = t.string()
    else node.type = t.any()
  }

  override visitCall(node: n.Call): void {
    super.visitCall(node)
    let fun = node.callee.type
    if (!(fun instanceof types.Function)) {
      throw new TypeCheckError('Cannot call non-function')
    }
    node.type = fun.returnType!
  }

  override visitClassConst(node: n.ClassConst): void {
    super.visitClassConst(node)
    if (node.type === null) {
      node.type = node.initializer.type
    }
  }

  override visitClassDeclaration(node: n.ClassDeclaration): void {
    super.visitClassDeclaration(node)
    node.type = new types.Instance(node)
  }

  override visitClassMethod(node: n.ClassMethod): void {
    super.visitClassMethod(node)
    let returnType = node.returnType ?? node.body.type
    if (returnType === null) {
      throw new TypeCheckError('Cannot infer function return type')
    }
    node.type = t.fun(
      node.params.map((p) => p.type!),
      returnType,
    )
  }

  override visitClassProperty(node: n.ClassProperty): void {
    super.visitClassProperty(node)
    if (node.type === null) {
      if (node.initializer === null) {
        throw new TypeCheckError('Cannot infer class property type')
      }
      node.type = node.initializer.type
    }
  }

  override visitClone(node: n.Clone): void {
    super.visitClone(node)
    node.type = node.expression.type!
  }

  override visitFunctionDeclaration(node: n.FunctionDeclaration): void {
    super.visitFunctionDeclaration(node)
    let returnType = node.returnType ?? node.body.type
    if (returnType === null) {
      throw new TypeCheckError('Cannot infer function return type')
    }
    node.type = t.fun(
      node.params.map((p) => p.type!),
      returnType,
    )
  }

  override visitGet(node: n.Get): void {
    super.visitGet(node)
    let type = node.object.type
    if (!(type instanceof types.Instance)) {
      throw new TypeCheckError('Cannot get property of non-class')
    }
    let class_ = type.node
    let symbol = class_.symbol(node.name)
    if (symbol === null) throw new TypeCheckError('Unknown symbol')
    node.type = symbol.type!
  }

  override visitGrouping(node: n.Grouping): void {
    super.visitGrouping(node)
    node.type = node.expression.type!
  }

  override visitIdentifier(node: n.Identifier): void {
    super.visitIdentifier(node)
    node.type = node.node!.type
  }

  override visitMatch(node: n.Match): void {
    super.visitMatch(node)
    let types = node.arms.map((arm) => arm.type!)
    if (node.defaultArm) {
      types.push(node.defaultArm.type!)
    }
    node.type = t.union(...types)
  }

  override visitMatchArm(node: n.MatchArm): void {
    super.visitMatchArm(node)
    node.type = node.body.type!
  }

  override visitNew(node: n.New): void {
    super.visitNew(node)
    let type = node.expression.type
    if (!(type instanceof types.Instance)) {
      throw new TypeCheckError('Cannot instantiate non-class')
    }
    node.type = type
  }

  override visitOptionalGet(node: n.OptionalGet): void {
    super.visitOptionalGet(node)
    let type = node.object.type
    if (!(type instanceof types.Instance)) {
      throw new TypeCheckError('Cannot get property of non-class')
    }
    let class_ = type.node
    let symbol = class_.symbol(node.name)
    if (symbol === null) throw new TypeCheckError('Unknown symbol')
    node.type = t.nullable(symbol.type!)
  }

  override visitParam(node: n.Param): void {
    super.visitParam(node)
    if (node.type === null) {
      if (node.initializer === null) {
        throw new TypeCheckError('Cannot infer param type')
      }
      node.type = node.initializer.type
    }
  }

  override visitPostfix(node: n.Postfix): void {
    super.visitPostfix(node)
    node.type = node.left.type!
  }

  override visitTernary(node: n.Ternary): void {
    super.visitTernary(node)
    node.type = t.union(node.left.type!, node.right.type!)
  }

  override visitUnary(node: n.Unary): void {
    super.visitUnary(node)
    if (node.operator === '!') {
      node.type = t.bool()
    } else if (
      node.operator === '-' ||
      node.operator === '+' ||
      node.operator === '++' ||
      node.operator === '--'
    ) {
      node.type = node.right.type!
    }
  }

  override visitVarDeclaration(node: n.VarDeclaration): void {
    super.visitVarDeclaration(node)
    if (!node.initializer) return
    let actual = node.initializer.type!
    if (node.type) {
      check(node.type, actual)
    } else {
      node.type = actual
    }
  }
}
