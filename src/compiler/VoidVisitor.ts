import * as n from '../nodes'

/**
 * A visitor that visits all nodes in the AST and returns void.
 */
export default class VoidVisitor implements n.Visitor<void> {
  visitArrayAccess(node: n.ArrayAccess): void {
    node.left.accept(this)
    node.index.accept(this)
  }

  visitArrayElement(node: n.ArrayElement): void {
    node.key?.accept(this)
    node.value.accept(this)
  }

  visitArrayLiteral(node: n.ArrayLiteral): void {
    for (let element of node.elements) {
      element.accept(this)
    }
  }

  visitAssign(node: n.Assign): void {
    node.left.accept(this)
    node.right.accept(this)
  }

  visitBinary(node: n.Binary): void {
    node.left.accept(this)
    node.right.accept(this)
  }

  visitBlock(node: n.Block): void {
    for (let statement of node.statements) {
      statement.accept(this)
    }
  }

  visitBooleanLiteral(node: n.BooleanLiteral): void {}

  visitCall(node: n.Call): void {
    node.callee.accept(this)
    node.args.forEach((arg) => arg.accept(this))
  }

  visitCatch(node: n.Catch): void {
    node.body.accept(this)
  }

  visitClassAbstractMethod(node: n.ClassAbstractMethod): void {
    node.params.forEach((param) => param.accept(this))
  }

  visitClassConst(node: n.ClassConst): void {
    node.initializer?.accept(this)
  }

  visitClassDeclaration(node: n.ClassDeclaration): void {
    node.params.forEach((param) => param.accept(this))
    node.superclass?.accept(this)
    node.iterates?.accept(this)
    node.members.forEach((member) => member.accept(this))
  }

  visitClassInitializer(node: n.ClassInitializer): void {
    node.body.accept(this)
  }

  visitClassMethod(node: n.ClassMethod): void {
    node.params.forEach((param) => param.accept(this))
    node.body.accept(this)
  }

  visitClassProperty(node: n.ClassProperty): void {
    node.initializer?.accept(this)
  }

  visitClassSuperclass(node: n.ClassSuperclass): void {
    node.args.forEach((arg) => arg.accept(this))
  }

  visitClone(node: n.Clone): void {
    node.expression.accept(this)
  }

  visitDestructuring(node: n.Destructuring): void {
    node.elements.forEach((element) => element?.accept(this))
  }

  visitDestructuringElement(node: n.DestructuringElement): void {}

  visitEcho(node: n.Echo): void {
    node.expression.accept(this)
  }

  visitExpressionStatement(node: n.ExpressionStatement): void {
    node.expression.accept(this)
  }

  visitFloatLiteral(node: n.FloatLiteral): void {}

  visitFor(node: n.For): void {
    node.initializer?.accept(this)
    node.condition?.accept(this)
    node.increment?.accept(this)
    node.body.accept(this)
  }

  visitForeach(node: n.Foreach): void {
    node.iterable.accept(this)
    node.key?.accept(this)
    node.value.accept(this)
    node.body.accept(this)
  }

  visitForeachVariable(node: n.ForeachVariable): void {}

  visitFunctionDeclaration(node: n.FunctionDeclaration): void {
    node.params.forEach((param) => param.accept(this))
    node.body.accept(this)
  }

  visitFunctionExpression(node: n.FunctionExpression): void {
    node.params.forEach((param) => param.accept(this))
    node.body.accept(this)
  }

  visitGet(node: n.Get): void {
    node.object.accept(this)
  }

  visitGrouping(node: n.Grouping): void {
    node.expression.accept(this)
  }

  visitIdentifier(node: n.Identifier): void {}

  visitIf(node: n.If): void {
    node.condition.accept(this)
    node.thenBranch.accept(this)
    node.elseBranch?.accept(this)
  }

  visitIntLiteral(node: n.IntLiteral): void {}

  visitMatch(node: n.Match): void {
    node.subject.accept(this)
    node.arms.forEach((arm) => arm.accept(this))
    node.defaultArm?.accept(this)
  }

  visitMatchArm(node: n.MatchArm): void {
    node.patterns.forEach((pattern) => pattern.accept(this))
    node.body.accept(this)
  }

  visitNew(node: n.New): void {
    node.expression.accept(this)
  }

  visitNullLiteral(node: n.NullLiteral): void {}

  visitOptionalGet(node: n.OptionalGet): void {
    node.object.accept(this)
  }

  visitParam(node: n.Param): void {
    node.initializer?.accept(this)
  }

  visitPipeline(node: n.Pipeline): void {
    node.left.accept(this)
    node.right.accept(this)
  }

  visitPostfix(node: n.Postfix): void {
    node.left.accept(this)
  }

  visitProgram(node: n.Program): void {
    for (let statement of node.statements) {
      statement.accept(this)
    }
  }

  visitReturn(node: n.Return): void {
    node.value?.accept(this)
  }

  visitScopeResolution(node: n.ScopeResolution): void {
    node.left.accept(this)
  }

  visitStringLiteral(node: n.StringLiteral): void {}

  visitSuper(): void {}

  visitTemplateStringLiteral(node: n.TemplateStringLiteral): void {
    node.parts.forEach((part) => part.accept(this))
  }

  visitTernary(node: n.Ternary): void {
    node.condition.accept(this)
    node.left.accept(this)
    node.right.accept(this)
  }

  visitThis(): void {}

  visitThrowExpression(node: n.ThrowExpression): void {
    node.expression.accept(this)
  }

  visitThrowStatement(node: n.ThrowStatement): void {
    node.expression.accept(this)
  }

  visitTry(node: n.Try): void {
    node.tryBlock.accept(this)
    node.catches.forEach((catch_) => catch_.accept(this))
    node.finallyBlock?.accept(this)
  }

  visitUnary(node: n.Unary): void {
    node.right.accept(this)
  }

  visitVarDeclaration(node: n.VarDeclaration): void {
    node.initializer?.accept(this)
  }

  visitVarDestructuringDeclaration(node: n.VarDestructuringDeclaration): void {
    node.destructuring.accept(this)
    node.initializer.accept(this)
  }

  visitWhile(node: n.While): void {
    node.condition.accept(this)
    node.body.accept(this)
  }
}
