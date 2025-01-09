import {
  ClosureEnvironment,
  Environment,
  LocalEnvironment,
} from '../parser/environment'
import * as n from '../nodes'
import ParseError from '../parser/ParseError'
import VoidVisitor from './VoidVisitor'
import { EnvironmentKind } from '../parser/environment'
import { builtinEnvironment } from '../parser/globalEnvironment'

export function defaultResolveUndeclaredIdentifier(
  name: string,
): EnvironmentKind {
  if (builtinEnvironment.has(name)) {
    return builtinEnvironment.get(name)!
  }
  throw new ParseError(`Undeclared identifier: ${name}`)
}

export default class BindIdentifiersVisitor extends VoidVisitor {
  private env = new Environments()
  private currentFunctionExpression: n.FunctionExpression | null = null

  constructor(
    private readonly resolveUndeclaredIdentifier = defaultResolveUndeclaredIdentifier,
  ) {
    super()
  }

  visit(node: n.Program): void {
    this.env.wrap(node.environment, () => node.accept(this))
  }

  override visitProgram(node: n.Program): void {
    let env = new LocalEnvironment()
    this.env.wrap(env, () => super.visitProgram(node))
  }

  // TODO consider scoping rules here... can it access locals from the enclosing scope?
  override visitClassDeclaration(node: n.ClassDeclaration): void {
    this.env.wrap(node.environment, () => super.visitClassDeclaration(node))
  }

  override visitClassMethod(node: n.ClassMethod): void {
    let env = new LocalEnvironment()
    node.params.forEach((p) => env.add(p.name))
    this.env.wrap(env, () => super.visitClassMethod(node))
  }

  // TODO wrap class init blocks in env with class params
  // TODO catch clauses
  // TODO for loops

  override visitDestructuring(node: n.Destructuring): void {
    super.visitDestructuring(node)
    node.elements.forEach((element) => {
      if (element) this.env.addLocal(element.value)
    })
  }

  override visitForeachVariable(node: n.ForeachVariable): void {
    this.env.addLocal(node.name)
  }

  override visitFunctionDeclaration(node: n.FunctionDeclaration): void {
    let env = new LocalEnvironment()
    node.params.forEach((p) => env.add(p.name))
    this.env.wrap(env, () => super.visitFunctionDeclaration(node))
  }

  override visitFunctionExpression(node: n.FunctionExpression): void {
    if (!(node.body instanceof n.Block)) {
      return super.visitFunctionExpression(node)
    }
    this.visitFunctionExpressionWithBlock(node)
  }

  // TODO comment me
  // TODO what about doubly-embedded function expressions?
  // TODO will this break if we try to create a class var that is a function expression?
  visitFunctionExpressionWithBlock(node: n.FunctionExpression): void {
    let env = new ClosureEnvironment(this.env.locals())
    node.params.forEach((p) => env.add(p.name))
    let prev = this.currentFunctionExpression
    this.currentFunctionExpression = node
    this.env.wrap(env, () => super.visitFunctionExpression(node))
    this.currentFunctionExpression = prev
  }

  override visitIdentifier(node: n.Identifier): void {
    let name = node.name
    let kind = this.env.resolve(name) ?? this.resolveUndeclaredIdentifier(name)
    node.bind(kind)
    if (kind === EnvironmentKind.ClosureVariable) {
      this.currentFunctionExpression?.addClosureVariable(name)
    }
  }

  override visitVarDeclaration(node: n.VarDeclaration): void {
    super.visitVarDeclaration(node)
    this.env.addLocal(node.name)
  }
}

class Environments {
  private environments: Environment[] = []

  private env(): Environment | undefined {
    return this.environments[this.environments.length - 1]
  }

  resolve(identifier: string): EnvironmentKind | null {
    for (let i = this.environments.length - 1; i >= 0; i--) {
      let env = this.environments[i]
      let kind = env.get(identifier)
      if (kind != null) return kind
    }
    return null
  }

  locals(): LocalEnvironment | ClosureEnvironment {
    let env = this.env()
    if (!(env instanceof LocalEnvironment)) {
      if (!(env instanceof ClosureEnvironment)) {
        throw new Error('Expected local environment')
      }
    }
    return env
  }

  // In PHP, functions can't access variables from the enclosing scope, with one exception: a function expression explicitly marks enclosed variables in a `use` clause. The function expression scenario is handled specifically elsewhere.
  wrap(env: Environment, fn: () => void): void {
    let locals =
      this.env() instanceof LocalEnvironment ? this.environments.pop() : null
    this.environments.push(env)
    fn()
    this.environments.pop()
    if (locals != null) this.environments.push(locals)
  }

  addLocal(name: string): void {
    this.locals().add(name)
  }
}
