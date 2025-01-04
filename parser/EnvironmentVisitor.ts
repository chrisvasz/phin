import { Environment, EnvironmentKind } from './environment'
import VoidVisitor from './VoidVisitor'
import * as nodes from './nodes'

export default class EnvironmentVisitor extends VoidVisitor {
  constructor(private readonly environment: Environment) {
    super()
  }

  override visitClassConst(node: nodes.ClassConst): void {
    this.environment.add(node.name, EnvironmentKind.ClassConst)
    super.visitClassConst(node)
  }

  override visitClassDeclaration(node: nodes.ClassDeclaration): void {
    this.environment.add(node.name, EnvironmentKind.Class)
    super.visitClassDeclaration(node)
  }

  override visitClassMethod(node: nodes.ClassMethod): void {
    this.environment.add(node.name, EnvironmentKind.ClassMethod)
    super.visitClassMethod(node)
  }

  override visitClassProperty(node: nodes.ClassProperty): void {
    this.environment.add(node.name, EnvironmentKind.ClassProperty)
    super.visitClassProperty(node)
  }

  override visitFunctionDeclaration(node: nodes.FunctionDeclaration): void {
    this.environment.add(node.name, EnvironmentKind.Function)
    super.visitFunctionDeclaration(node)
  }

  override visitParam(node: nodes.Param): void {
    this.environment.add(node.name, EnvironmentKind.Variable)
    super.visitParam(node)
  }

  override visitVarDeclaration(node: nodes.VarDeclaration): void {
    this.environment.add(node.name, EnvironmentKind.Variable)
    super.visitVarDeclaration(node)
  }
}
