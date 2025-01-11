import VoidVisitor from './VoidVisitor'
import * as n from '../nodes'
import * as t from '../types'
import { Type } from '../types'

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
  if (!actual.isAssignableTo(expected)) {
    throw new TypeMismatch(expected, actual)
  }
}

export default class TypeCheckVisitor extends VoidVisitor {
  visit(node: n.Program): void {
    node.accept(this)
  }

  override visitVarDeclaration(node: n.VarDeclaration): void {
    super.visitVarDeclaration(node)
    if (!(node.initializer instanceof n.TypedNode)) return
    if (!node.type) return
    check(node.type(), node.initializer.type())
  }

  override visitFunctionDeclaration(node: n.FunctionDeclaration): void {
    super.visitFunctionDeclaration(node)
    if (!node.returnType) return
    if (!(node.body instanceof n.TypedNode)) return
    check(node.returnType, node.body.type())
  }

  override visitFunctionExpression(node: n.FunctionExpression): void {
    super.visitFunctionExpression(node)
    if (!node.returnType) return
    if (!(node.body instanceof n.TypedNode)) return
    check(node.returnType, node.body.type())
  }
}
