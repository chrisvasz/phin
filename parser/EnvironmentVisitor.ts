import { Environment, EnvironmentKind } from './environment'
import VoidVisitor from './VoidVisitor'
import * as nodes from './nodes'
import { globalEnvironment } from './globalEnvironment'

/**
 * Establishes the environment for a program by visiting all nodes and adding
 * declarations to the environment. TODO
 */
export default class EnvironmentVisitor extends VoidVisitor {
  environment: Environment = new Environment(globalEnvironment)

  constructor() {
    super()
  }

  override visitClassConst(node: nodes.ClassConst): void {
    this.environment.add(node.name, EnvironmentKind.ClassConst)
    super.visitClassConst(node)
  }

  override visitClassDeclaration(node: nodes.ClassDeclaration): void {
    // per php semantics, add all class members to the environment immediately
    let env = node.environment
    for (let member of node.members) {
      if (member instanceof nodes.ClassMethod) {
        env.add(member.name, EnvironmentKind.ClassMethod)
      } else if (member instanceof nodes.ClassProperty) {
        env.add(member.name, EnvironmentKind.ClassProperty)
      } else if (member instanceof nodes.ClassConst) {
        env.add(member.name, EnvironmentKind.ClassConst)
      }
    }
    this.wrap(env, () => super.visitClassDeclaration(node))
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
    // TODO could do this part during parsing
    // TODO can't do var declarations during parsing because they aren't hoisted
    let env = node.environment
    for (let s of node.statements) {
      if (s instanceof nodes.FunctionDeclaration) {
        env.add(s.name, EnvironmentKind.Function)
      } else if (s instanceof nodes.ClassDeclaration) {
        env.add(s.name, EnvironmentKind.Class)
      }
    }
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