import { Environment, EnvironmentKind } from './environment'
import VoidVisitor from './VoidVisitor'
import * as nodes from './nodes'
import { globalEnvironment } from './globalEnvironment'

export default class FindUndeclaredIdentifiersVisitor extends VoidVisitor {
  environment: Environment = new Environment(globalEnvironment)

  constructor() {
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

  override visitIdentifier(node: nodes.Identifier): void {
    if (!this.environment.has(node.name)) {
      throw new Error(`Undeclared identifier: ${node.name}`)
    }
    super.visitIdentifier(node)
  }

  override visitParam(node: nodes.Param): void {
    this.environment.add(node.name, EnvironmentKind.Variable)
    super.visitParam(node)
  }

  override visitProgram(node: nodes.Program): void {
    // per php semantics, add all class and function declarations to the environment immediately
    let env = node.environment
    let fns = node.statements.filter(
      (s) => s instanceof nodes.FunctionDeclaration,
    )
    fns.forEach((fn) => env.add(fn.name, EnvironmentKind.Function))
    let classes = node.statements.filter(
      (s) => s instanceof nodes.ClassDeclaration,
    )
    classes.forEach((cls) => env.add(cls.name, EnvironmentKind.Class))
    this.wrap(env, () => super.visitProgram(node))
  }

  override visitVarDeclaration(node: nodes.VarDeclaration): void {
    this.environment.add(node.name, EnvironmentKind.Variable)
    super.visitVarDeclaration(node)
  }

  wrap(next: Environment, fn: () => void) {
    let prev = this.environment
    this.environment = next
    fn()
    this.environment = prev
  }
}
