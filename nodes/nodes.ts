import { Type } from '../types'

export abstract class Node {
  abstract _type: string
  abstract accept<T>(visitor: Visitor<T>): T
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
  visitPostfix(node: Postfix): T
  visitPrefix(node: Prefix): T
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
  visitWhile(node: While): T
}

export class If extends Node {
  _type = 'If' as const
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
  _type = 'Block' as const
  constructor(public readonly statements: Node[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBlock(this)
  }
}

export class VarDeclaration extends Node {
  _type = 'VarDeclaration' as const
  constructor(
    public readonly name: string | string[],
    public readonly type: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVarDeclaration(this)
  }
}

export class Echo extends Node {
  _type = 'Echo' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitEcho(this)
  }
}

export class ExpressionStatement extends Node {
  _type = 'ExpressionStatement' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitExpressionStatement(this)
  }
}

export class While extends Node {
  _type = 'While' as const
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
  _type = 'For' as const
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
  _type = 'Foreach' as const
  constructor(
    public readonly key: ForeachVariable | null,
    public readonly value: ForeachVariable,
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
  _type = 'ForeachVariable' as const
  constructor(
    public readonly name: string,
    public readonly type: Type | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitForeachVariable(this)
  }
}

export class FunctionDeclaration extends Node {
  _type = 'FunctionDeclaration' as const
  constructor(
    public readonly name: string,
    public readonly params: Param[],
    public readonly returnType: Type | null,
    public readonly body: Block | Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionDeclaration(this)
  }
}

function paramIsExpressibleInPhp(this: Param) {
  return this.type === null || this.type.isExpressibleInPhp()
}

function simplifyParam(this: Param) {
  let type = this.type
  if (type === null || type.isExpressibleInPhp()) return this
  return new Param(this.name, type.simplify(), this.initializer)
}

export class Param extends Node {
  _type = 'Param' as const
  constructor(
    public readonly name: string,
    public readonly type: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitParam(this)
  }
  isExpressibleInPhp = paramIsExpressibleInPhp
  simplify = simplifyParam
}

export class Return extends Node {
  _type = 'Return' as const
  constructor(public readonly value: Expr | null) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitReturn(this)
  }
}

export class Try extends Node {
  _type = 'Try' as const
  constructor(
    public readonly tryBlock: Block,
    public readonly catches: Catch[],
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
  _type = 'Catch' as const
  constructor(
    public readonly variable: string,
    public readonly types: string[],
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
  _type = 'ThrowStatement' as const
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
  ) as ClassProperty[]
}

export class ClassDeclaration extends Node {
  _type = 'ClassDeclaration' as const
  constructor(
    public readonly name: string,
    public readonly constructorVisibility: Visibility,
    public readonly params: Array<Param | ClassProperty>,
    public readonly superclass: ClassSuperclass | null,
    public readonly interfaces: string[],
    public readonly iterates: Identifier | null,
    public readonly members: ClassMember[],
    public readonly isAbstract: boolean = false,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassDeclaration(this)
  }
  properties = classProperties
}

export class ClassSuperclass extends Node {
  _type = 'ClassSuperclass' as const
  constructor(
    public readonly name: string,
    public readonly args: Expr[],
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassSuperclass(this)
  }
}

export class ClassProperty extends Node {
  _type = 'ClassProperty' as const
  constructor(
    public readonly isFinal: boolean,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly isReadonly: boolean,
    public readonly name: string,
    public readonly type: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassProperty(this)
  }
}

export class ClassMethod extends Node {
  _type = 'ClassMethod' as const
  constructor(
    public readonly isFinal: boolean,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly name: string,
    public readonly params: Param[],
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
  _type = 'ClassAbstractMethod' as const
  constructor(
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly name: string,
    public readonly params: Param[],
    public readonly returnType: Type | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassAbstractMethod(this)
  }
}

export class ClassConst extends Node {
  _type = 'ClassConst' as const
  constructor(
    public readonly isFinal: boolean,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly name: string,
    public readonly type: Type | null,
    public readonly initializer: Expr, // TODO must be compile-time constant
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassConst(this)
  }
}

export class ClassInitializer extends Node {
  _type = 'ClassInitializer' as const
  constructor(public readonly body: Block) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassInitializer(this)
  }
}

export class Assign extends Node {
  _type = 'Assign' as const
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
  _type = 'Call' as const
  constructor(
    public readonly callee: Expr,
    public readonly args: Expr[],
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCall(this)
  }
}

export class Get extends Node {
  _type = 'Get' as const
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
  _type = 'OptionalGet' as const
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

export class Binary extends Node {
  _type = 'Binary' as const
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
}

export class Ternary extends Node {
  _type = 'Ternary' as const
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
  _type = 'Grouping' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGrouping(this)
  }
}

export class NumberLiteral extends Node {
  _type = 'NumberLiteral' as const
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteral(this)
  }
}

export class StringLiteral extends Node {
  _type = 'StringLiteral' as const
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteral(this)
  }
}

export class TemplateStringLiteral extends Node {
  _type = 'TemplateStringLiteral' as const
  constructor(public readonly parts: Array<StringLiteral | Expr>) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTemplateStringLiteral(this)
  }
}

export class DoubleQuoteStringLiteral extends Node {
  _type = 'TemplateStringLiteral' as const
  constructor(public readonly parts: Array<StringLiteral | Expr>) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTemplateStringLiteral(this)
  }
}

export class BooleanLiteral extends Node {
  _type = 'BooleanLiteral' as const
  constructor(public readonly value: boolean) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanLiteral(this)
  }
}

export class NullLiteral extends Node {
  _type = 'NullLiteral' as const
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullLiteral(this)
  }
}

export class ArrayLiteral extends Node {
  _type = 'ArrayLiteral' as const
  constructor(public readonly elements: ArrayElement[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayLiteral(this)
  }
}

export class ArrayElement extends Node {
  _type = 'ArrayElement' as const
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
  _type = 'ArrayAccess' as const
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
  _type = 'Unary' as const
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
  _type = 'Prefix' as const
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
  _type = 'Postfix' as const
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
  _type = 'Identifier' as const
  constructor(public readonly name: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIdentifier(this)
  }
}

export class FunctionExpression extends Node {
  _type = 'FunctionExpression' as const
  constructor(
    public readonly params: Param[],
    public readonly returnType: Type | null,
    public readonly body: Expr | Block,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionExpression(this)
  }
}

export class New extends Node {
  _type = 'New' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNew(this)
  }
}

export class Clone extends Node {
  _type = 'Clone' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClone(this)
  }
}

export class Match extends Node {
  _type = 'Match' as const
  constructor(
    public readonly subject: Expr,
    public readonly arms: MatchArm[],
    public readonly defaultArm: Expr | null,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatch(this)
  }
}

export class MatchArm extends Node {
  _type = 'MatchArm' as const
  constructor(
    public readonly patterns: Expr[],
    public readonly body: Expr,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatchArm(this)
  }
}

export class ThrowExpression extends Node {
  _type = 'ThrowExpression' as const
  constructor(public readonly expression: Expr) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThrowExpression(this)
  }
}

export class This extends Node {
  _type = 'This' as const
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThis()
  }
}

export class Super extends Node {
  _type = 'Super' as const
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitSuper()
  }
}

export class ScopeResolution extends Node {
  _type = 'ScopeResolution' as const
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
