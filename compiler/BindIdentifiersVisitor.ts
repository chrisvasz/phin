import {
  Environment,
  HoistedEnvironment,
  LocalEnvironment,
} from '../parser/environment'
import * as n from '../nodes'
import ParseError from '../parser/ParseError'
import VoidVisitor from './VoidVisitor'
import { EnvironmentKind } from '../parser/environment'

export function defaultResolveUndeclaredIdentifiers(
  name: string,
): EnvironmentKind {
  throw new ParseError(`Undeclared identifier: ${name}`)
}

export default class BindIdentifiersVisitor extends VoidVisitor {
  currentEnvironment: Environment = new HoistedEnvironment(null)

  constructor(
    private readonly resolveUndeclaredIdentifiers = defaultResolveUndeclaredIdentifiers,
  ) {
    super()
  }

  visit(node: n.Program): void {
    node.accept(this)
  }

  private wrap(next: Environment, fn: () => void): void {
    let prev = this.currentEnvironment
    this.currentEnvironment = next
    fn()
    this.currentEnvironment = prev
  }

  override visitProgram(node: n.Program): void {
    this.wrap(node.environment, () => {
      super.visitProgram(node)
    })
  }

  override visitClassDeclaration(node: n.ClassDeclaration): void {
    this.wrap(node.environment, () => {
      super.visitClassDeclaration(node)
    })
  }

  override visitClassMethod(node: n.ClassMethod): void {
    // TODO do this more efficiently
    let env = new LocalEnvironment(this.currentEnvironment)
    node.params.forEach((param) =>
      env.add(param.name, EnvironmentKind.Variable),
    )
    this.wrap(env, () => {
      super.visitClassMethod(node)
    })
  }

  // TODO wrap class init blocks in env with class params
  // TODO catch clauses
  // TODO for loops and foreach loops

  override visitFunctionDeclaration(node: n.FunctionDeclaration): void {
    // TODO do this more efficiently
    let env = new LocalEnvironment(this.currentEnvironment)
    node.params.forEach((param) =>
      env.add(param.name, EnvironmentKind.Variable),
    )
    this.wrap(env, () => {
      super.visitFunctionDeclaration(node)
    })
  }

  // TODO do this more efficiently
  override visitIdentifier(node: n.Identifier): void {
    let kind =
      this.currentEnvironment.get(node.name) ??
      this.resolveUndeclaredIdentifiers(node.name)
    node.bind(kind)
  }

  override visitVarDeclaration(node: n.VarDeclaration): void {
    this.currentEnvironment.add(node.name, EnvironmentKind.Variable)
    super.visitVarDeclaration(node)
  }
}
