import VoidVisitor from './VoidVisitor'
import * as n from '../nodes'

export class TypeCheckError extends Error {
  override name: string = 'TypeCheckError'
}

export default class TypeCheckVisitor extends VoidVisitor {
  visit(node: n.Program): void {
    node.accept(this)
  }

  override visitVarDeclaration(node: n.VarDeclaration): void {
    throw new Error('Method not implemented.')
    // if (!node.initializer) return
    // if (!node.type) return
    // if (!node.initializer.type().isAssignableTo(node.type)) {
    //   throw new TypeCheckError(
    //     `Type error: ${node.initializer.type()} is not assignable to ${node.type}`,
    //   )
    // }
  }
}
