import { ClassSymbols, HoistedSymbols } from './symbols'
import { t } from './builder'
import { Type } from './types'

export abstract class Node {
  abstract _name: string
  abstract accept<T>(visitor: Visitor<T>): T
  type: Type | null = null
}

export type Visibility = 'public' | 'protected' | 'private' | null
export type FinalOrAbstract = 'final' | 'abstract' | null
export type ClassMember =
  | ClassMethod
  | ClassAbstractMethod
  | ClassProperty
  | ClassConst
  | ClassInitializer
export type Stmt =
  | Block
  | Catch
  | ClassDeclaration
  | Echo
  | ExpressionStatement
  | For
  | Foreach
  | FunctionDeclaration
  | If
  | Return
  | ThrowStatement
  | Try
  | VarDeclaration
  | VarDestructuringDeclaration
  | While
export type Expr =
  | ArrayAccess
  | ArrayLiteral
  | Assign
  | Binary
  | BooleanLiteral
  | Call
  | Clone
  | FunctionExpression
  | Get
  | Grouping
  | Identifier
  | Match
  | New
  | NullLiteral
  | NumberLiteral
  | OptionalGet
  | Pipeline
  | Postfix
  | Prefix
  | ScopeResolution
  | StringLiteral
  | Super
  | TemplateStringLiteral
  | Ternary
  | This
  | ThrowExpression
  | Unary

export interface Visitor<T> {
  visitArrayAccess(node: ArrayAccess): T
  visitArrayElement(node: ArrayElement): T
  visitArrayLiteral(node: ArrayLiteral): T
  visitAssign(node: Assign): T
  visitBinary(node: Binary): T
  visitBlock(node: Block): T
  visitBooleanLiteral(node: BooleanLiteral): T
  visitCall(node: Call): T
  visitCatch(node: Catch): T
  visitClassAbstractMethod(node: ClassAbstractMethod): T
  visitClassConst(node: ClassConst): T
  visitClassDeclaration(node: ClassDeclaration): T
  visitClassInitializer(node: ClassInitializer): T
  visitClassMethod(node: ClassMethod): T
  visitClassProperty(node: ClassProperty): T
  visitClassSuperclass(node: ClassSuperclass): T
  visitClone(node: Clone): T
  visitDestructuring(node: Destructuring): T
  visitDestructuringElement(node: DestructuringElement): T
  visitEcho(node: Echo): T
  visitExpressionStatement(node: ExpressionStatement): T
  visitFor(node: For): T
  visitForeach(node: Foreach): T
  visitForeachVariable(node: ForeachVariable): T
  visitFunctionDeclaration(node: FunctionDeclaration): T
  visitFunctionExpression(node: FunctionExpression): T
  visitGetExpr(node: Get): T
  visitGrouping(node: Grouping): T
  visitIdentifier(node: Identifier): T
  visitIf(node: If): T
  visitMatch(node: Match): T
  visitMatchArm(node: MatchArm): T
  visitNew(node: New): T
  visitNullLiteral(node: NullLiteral): T
  visitNumberLiteral(node: NumberLiteral): T
  visitOptionalGet(node: OptionalGet): T
  visitParam(node: Param): T
  visitPipeline(node: Pipeline): T
  visitPostfix(node: Postfix): T
  visitPrefix(node: Prefix): T
  visitProgram(node: Program): T
  visitReturn(node: Return): T
  visitScopeResolution(node: ScopeResolution): T
  visitStringLiteral(node: StringLiteral): T
  visitSuper(): T
  visitTemplateStringLiteral(node: TemplateStringLiteral): T
  visitTernary(node: Ternary): T
  visitThis(): T
  visitThrowExpression(node: ThrowExpression): T
  visitThrowStatement(node: ThrowStatement): T
  visitTry(node: Try): T
  visitUnary(node: Unary): T
  visitVarDeclaration(node: VarDeclaration): T
  visitVarDestructuringDeclaration(node: VarDestructuringDeclaration): T
  visitWhile(node: While): T
}

export class Program extends Node {
  _name = 'Program' as const
  constructor(
    public readonly statements: Array<Node>,
    public readonly symbols: HoistedSymbols = new HoistedSymbols(),
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitProgram(this)
  }
}

export class If extends Node {
  _name = 'If' as const
  constructor(
    public readonly condition: Expr,
    public readonly thenBranch: Stmt,
    public readonly elseBranch: Stmt | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIf(this)
  }
}

export class Block extends Node {
  _name = 'Block' as const
  constructor(public readonly statements: Array<Node>) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBlock(this)
  }
}

export class VarDeclaration extends Node {
  _name = 'VarDeclaration' as const
  constructor(
    public readonly name: string,
    public readonly typeAnnotation: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super()
    this.type = typeAnnotation
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVarDeclaration(this)
  }
}

export class VarDestructuringDeclaration extends Node {
  _name = 'VarDestructuringDeclaration' as const
  constructor(
    public readonly destructuring: Destructuring,
    public readonly initializer: Expr,
  ) {
    super()
  }
  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVarDestructuringDeclaration(this)
  }
}

export class Destructuring extends Node {
  _name = 'Destructure' as const
  constructor(public readonly elements: Array<DestructuringElement | null>) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitDestructuring(this)
  }
}

export class DestructuringElement extends Node {
  _name = 'DestructuringElement' as const
  constructor(
    public readonly key: string | null,
    public readonly value: string,
    public readonly _type: Type | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitDestructuringElement(this)
  }
}

export class Echo extends Node {
  _name = 'Echo' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitEcho(this)
  }
}

export class ExpressionStatement extends Node {
  _name = 'ExpressionStatement' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitExpressionStatement(this)
  }
}

export class While extends Node {
  _name = 'While' as const
  constructor(
    public readonly condition: Expr,
    public readonly body: Node,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitWhile(this)
  }
}

export class For extends Node {
  _name = 'For' as const
  constructor(
    public readonly initializer: Node | null,
    public readonly condition: Expr | null,
    public readonly increment: Expr | null,
    public readonly body: Node,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFor(this)
  }
}

export class Foreach extends Node {
  _name = 'Foreach' as const
  constructor(
    public readonly key: ForeachVariable | null,
    public readonly value: ForeachVariable | Destructuring,
    public readonly iterable: Expr,
    public readonly body: Node,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitForeach(this)
  }
}

export class ForeachVariable extends Node {
  _name = 'ForeachVariable' as const
  constructor(
    public readonly name: string,
    public readonly _type: Type | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitForeachVariable(this)
  }
}

export class FunctionDeclaration extends Node {
  _name = 'FunctionDeclaration' as const
  constructor(
    public readonly name: string,
    public readonly params: Array<Param>,
    public readonly returnType: Type | null,
    public readonly body: Block | Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionDeclaration(this)
  }
}

export class Param extends Node {
  _name = 'Param' as const
  constructor(
    public readonly name: string,
    public readonly typeAnnotation: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super()
    this.type = typeAnnotation
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitParam(this)
  }
  isExpressibleInPhp() {
    return this.type?.isExpressibleInPhp() ?? false
  }
  simplify() {
    return this.type?.simplify() ?? this.type
  }
}

export class Return extends Node {
  _name = 'Return' as const
  constructor(public readonly value: Expr | null) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitReturn(this)
  }
}

export class Try extends Node {
  _name = 'Try' as const
  constructor(
    public readonly tryBlock: Block,
    public readonly catches: Array<Catch>,
    public readonly finallyBlock: null | Block,
  ) {
    super()
    if (catches.length === 0 && finallyBlock === null) {
      throw new Error(
        'Try statement must have at least one catch or finally block',
      )
    }
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTry(this)
  }
}

export class Catch extends Node {
  _name = 'Catch' as const
  constructor(
    public readonly variable: string,
    public readonly types: Array<string>,
    public readonly body: Block,
  ) {
    super()
    if (types.length === 0) {
      throw new Error('Catch variable must have at least one type')
    }
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCatch(this)
  }
}

export class ThrowStatement extends Node {
  _name = 'ThrowStatement' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThrowStatement(this)
  }
}

function classProperties(this: ClassDeclaration) {
  return this.members.filter(
    (m) => m instanceof ClassProperty,
  ) as Array<ClassProperty>
}

export class ClassDeclaration extends Node {
  _name = 'ClassDeclaration' as const
  constructor(
    public readonly name: string,
    public readonly constructorVisibility: Visibility,
    public readonly params: Array<Param | ClassProperty>,
    public readonly superclass: ClassSuperclass | null,
    public readonly interfaces: Array<string>,
    public readonly iterates: Identifier | null,
    public readonly members: Array<ClassMember>,
    public readonly isAbstract: boolean = false,
    public readonly symbols: ClassSymbols,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassDeclaration(this)
  }
  properties = classProperties
}

export class ClassSuperclass extends Node {
  _name = 'ClassSuperclass' as const
  constructor(
    public readonly name: string,
    public readonly args: Array<Expr>,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassSuperclass(this)
  }
}

export class ClassProperty extends Node {
  _name = 'ClassProperty' as const
  constructor(
    public readonly isFinal: boolean,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly isReadonly: boolean,
    public readonly name: string,
    public readonly typeAnnotation: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super()
    this.type = typeAnnotation
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassProperty(this)
  }
}

export class ClassMethod extends Node {
  _name = 'ClassMethod' as const
  constructor(
    public readonly isFinal: boolean,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly name: string,
    public readonly params: Array<Param>,
    public readonly returnType: Type | null,
    public readonly body: Block | Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassMethod(this)
  }
}

export class ClassAbstractMethod extends Node {
  _name = 'ClassAbstractMethod' as const
  constructor(
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly name: string,
    public readonly params: Array<Param>,
    public readonly returnType: Type | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassAbstractMethod(this)
  }
}

export class ClassConst extends Node {
  _name = 'ClassConst' as const
  constructor(
    public readonly isFinal: boolean,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly name: string,
    public readonly typeAnnotation: Type | null,
    public readonly initializer: Expr, // TODO must be compile-time constant. this and others
  ) {
    super()
    this.type = typeAnnotation
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassConst(this)
  }
}

export class ClassInitializer extends Node {
  _name = 'ClassInitializer' as const
  constructor(public readonly body: Block) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassInitializer(this)
  }
}

export class Assign extends Node {
  _name = 'Assign' as const
  constructor(
    public readonly name: Identifier | Get | ArrayAccess,
    public readonly operator: string,
    public readonly value: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAssign(this)
  }
}

export class Call extends Node {
  _name = 'Call' as const
  constructor(
    public readonly callee: Expr,
    public readonly args: Array<Expr>,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCall(this)
  }
}

export class Get extends Node {
  _name = 'Get' as const
  constructor(
    public readonly object: Expr,
    public readonly name: string,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGetExpr(this)
  }
}

export class OptionalGet extends Node {
  _name = 'OptionalGet' as const
  constructor(
    public readonly object: Expr,
    public readonly name: string,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitOptionalGet(this)
  }
}

export class Pipeline extends Node {
  _name = 'Pipeline' as const
  constructor(
    public readonly left: Expr,
    public readonly right: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitPipeline(this)
  }
}

export class Binary extends Node {
  _name = 'Binary' as const
  constructor(
    public readonly left: Expr,
    public readonly operator: string,
    public readonly right: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBinary(this)
  }
  _type(): Type {
    if (this.operator === '==') return t.bool()
    if (this.operator === '!=') return t.bool()
    if (this.operator === '===') return t.bool()
    if (this.operator === '!==') return t.bool()
    if (this.operator === '<') return t.bool()
    if (this.operator === '<=') return t.bool()
    if (this.operator === '>') return t.bool()
    if (this.operator === '>=') return t.bool()
    if (this.operator === '&&') return t.bool()
    if (this.operator === '||') return t.bool()
    if (this.operator === '+.') return t.string()
    return t.any()
  }
}

export class Ternary extends Node {
  _name = 'Ternary' as const
  constructor(
    public readonly condition: Expr,
    public readonly left: Expr,
    public readonly right: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTernary(this)
  }
}

export class Grouping extends Node {
  _name = 'Grouping' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGrouping(this)
  }
}

export class NumberLiteral extends Node {
  _name = 'NumberLiteral' as const
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteral(this)
  }
}

export class StringLiteral extends Node {
  _name = 'StringLiteral' as const
  constructor(public readonly value: string) {
    super()
    this.type = t.string()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteral(this)
  }
}

export class TemplateStringLiteral extends Node {
  _name = 'TemplateStringLiteral' as const
  constructor(public readonly parts: Array<StringLiteral | Expr>) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTemplateStringLiteral(this)
  }
}

export class BooleanLiteral extends Node {
  _name = 'BooleanLiteral' as const
  constructor(public readonly value: boolean) {
    super()
    this.type = value ? t.true() : t.false()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanLiteral(this)
  }
}

export class NullLiteral extends Node {
  _name = 'NullLiteral' as const
  constructor() {
    super()
    this.type = t.null()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullLiteral(this)
  }
}

export class ArrayLiteral extends Node {
  _name = 'ArrayLiteral' as const
  constructor(public readonly elements: Array<ArrayElement>) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayLiteral(this)
  }
}

export class ArrayElement extends Node {
  _name = 'ArrayElement' as const
  constructor(
    public readonly key: NumberLiteral | StringLiteral | null,
    public readonly value: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayElement(this)
  }
}

export class ArrayAccess extends Node {
  _name = 'ArrayAccess' as const
  constructor(
    public readonly left: Expr,
    public readonly index: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayAccess(this)
  }
}

export class Unary extends Node {
  _name = 'Unary' as const
  constructor(
    public readonly operator: string,
    public readonly right: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnary(this)
  }
}

export class Prefix extends Node {
  _name = 'Prefix' as const
  constructor(
    public readonly operator: string,
    public readonly right: Identifier,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitPrefix(this)
  }
}

export class Postfix extends Node {
  _name = 'Postfix' as const
  constructor(
    public readonly left: Identifier,
    public readonly operator: string,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitPostfix(this)
  }
}

export class Identifier extends Node {
  _name = 'Identifier' as const
  node: Node | null = null
  constructor(public readonly name: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIdentifier(this)
  }
  bind(node: Node) {
    this.node = node
  }
}

export class FunctionExpression extends Node {
  _name = 'FunctionExpression' as const
  public readonly closureVariables: Array<string> = []
  constructor(
    public readonly params: Array<Param>,
    public readonly returnType: Type | null,
    public readonly body: Expr | Block,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionExpression(this)
  }
  addClosureVariable(id: string) {
    this.closureVariables.push(id)
  }
}

export class New extends Node {
  _name = 'New' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNew(this)
  }
}

export class Clone extends Node {
  _name = 'Clone' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClone(this)
  }
}

export class Match extends Node {
  _name = 'Match' as const
  constructor(
    public readonly subject: Expr,
    public readonly arms: Array<MatchArm>,
    public readonly defaultArm: Expr | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatch(this)
  }
}

export class MatchArm extends Node {
  _name = 'MatchArm' as const
  constructor(
    public readonly patterns: Array<Expr>,
    public readonly body: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatchArm(this)
  }
}

export class ThrowExpression extends Node {
  _name = 'ThrowExpression' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThrowExpression(this)
  }
}

export class This extends Node {
  _name = 'This' as const
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThis()
  }
}

export class Super extends Node {
  _name = 'Super' as const
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitSuper()
  }
}

export class ScopeResolution extends Node {
  _name = 'ScopeResolution' as const
  constructor(
    public readonly left: Expr,
    public readonly right: string,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitScopeResolution(this)
  }
}
