import * as nodes from '../nodes'
import * as types from '../types'
import { Type } from '../types'

const tab = '  '

export class PhpPrinter
  implements nodes.Visitor<string>, types.Visitor<string>
{
  currentIndent = 0

  print(statements: nodes.Node[]): string {
    let result = ''
    for (let s of statements) {
      result += s.accept(this)
    }
    return result
  }

  indent(content: string | string[]): string {
    if (typeof content === 'string')
      return tab.repeat(this.currentIndent) + content
    return content.map((c) => tab.repeat(this.currentIndent) + c).join('\n')
  }

  /////////////////////////////
  // TYPES
  /////////////////////////////

  visitBooleanType = () => 'bool'
  visitFalseType = () => 'false'
  visitFloatType = () => 'float'
  visitIntType = () => 'int'
  visitNullType = () => 'null'
  visitNumberType = () => 'number'
  visitStringType = () => 'string'
  visitTrueType = () => 'true'

  visitIdentifierType(identifier: types.Identifier): string {
    let result = identifier.name
    if (identifier.generics.length > 0) {
      let generics = identifier.generics.map((g) => g.accept(this)).join(', ')
      result += `<${generics}>`
    }
    return result
  }

  visitIntersectionType(intersection: types.Intersection): string {
    return intersection.types.map((t) => t.accept(this)).join('&')
  }

  visitNullableType(nullable: types.Nullable): string {
    return '?' + nullable.type.accept(this)
  }

  visitNumberLiteralType(numberLiteral: types.NumberLiteral): string {
    throw new Error('Method not implemented.')
  }
  visitStringLiteralType(stringLiteral: types.StringLiteral): string {
    throw new Error('Method not implemented.')
  }

  visitUnionType(union: types.Union): string {
    return union.types.map((t) => t.accept(this)).join('|')
  }

  /////////////////////////////
  // STATEMENTS
  /////////////////////////////

  visitClassAbstractMethod(node: nodes.ClassAbstractMethod): string {
    throw new Error('Method not implemented.')
  }
  visitArrayElement(node: nodes.ArrayElement): string {
    throw new Error('Method not implemented.')
  }
  visitArrayLiteral(node: nodes.ArrayLiteral): string {
    throw new Error('Method not implemented.')
  }
  visitAssign(node: nodes.Assign): string {
    throw new Error('Method not implemented.')
  }

  visitBinary(node: nodes.Binary): string {
    let left = node.left.accept(this)
    let right = node.right.accept(this)
    return `${left} ${node.operator} ${right}`
  }

  visitBlock(node: nodes.Block): string {
    if (node.statements.length === 0) return '{}'
    let lines = node.statements.map((s) => s.accept(this))
    return `{\n${this.indent(lines)}\n}`
  }

  visitBooleanLiteral(node: nodes.BooleanLiteral): string {
    throw new Error('Method not implemented.')
  }

  visitCall(node: nodes.Call): string {
    return `${node.callee.accept(this)}(${node.args.map((a) => a.accept(this)).join(', ')})`
  }

  visitCatch(node: nodes.Catch): string {
    throw new Error('Method not implemented.')
  }
  visitClassConst(node: nodes.ClassConst): string {
    throw new Error('Method not implemented.')
  }
  visitClassInitializer(node: nodes.ClassInitializer): string {
    throw new Error('Method not implemented.')
  }
  visitClassMethod(node: nodes.ClassMethod): string {
    throw new Error('Method not implemented.')
  }
  visitClassParam(node: nodes.ClassParam): string {
    throw new Error('Method not implemented.')
  }
  visitClassProperty(node: nodes.ClassProperty): string {
    throw new Error('Method not implemented.')
  }
  visitClassDeclaration(node: nodes.ClassDeclaration): string {
    throw new Error('Method not implemented.')
  }
  visitClassSuperclass(node: nodes.ClassSuperclass): string {
    throw new Error('Method not implemented.')
  }
  visitClone(node: nodes.Clone): string {
    throw new Error('Method not implemented.')
  }

  visitEcho(node: nodes.Echo): string {
    return `echo ${node.expression.accept(this)};`
  }

  visitExpressionStatement(node: nodes.ExpressionStatement): string {
    return node.expression.accept(this) + ';'
  }

  visitForeach(node: nodes.Foreach): string {
    throw new Error('Method not implemented.')
  }
  visitFor(node: nodes.For): string {
    throw new Error('Method not implemented.')
  }

  visitFunctionExpression(node: nodes.FunctionExpression): string {
    let params = node.params.map((p) => p.accept(this)).join(', ')
    let type = node.returnType
      ? `: ${node.returnType.simplify().accept(this)}`
      : ''
    let body = node.body.accept(this)
    if (!(node.body instanceof nodes.Block)) {
      body = '{\n' + `return ${body};` + '\n}'
    }
    let result = `function (${params})${type} ${body}`
    return `${result}`
  }

  visitFunctionDeclaration(node: nodes.FunctionDeclaration): string {
    let params = node.params.map((p) => p.accept(this)).join(', ')
    let type = node.returnType
      ? `: ${node.returnType.simplify().accept(this)}`
      : ''
    let body = node.body.accept(this)
    if (!(node.body instanceof nodes.Block)) {
      body = '{\n' + `return ${body};` + '\n}'
    }
    let result = `function ${node.name}(${params})${type} ${body}`
    let docblock = this.functionDocblock(node.params, node.returnType)
    return `${docblock}${result}`
  }

  functionDocblock(params: nodes.Param[], returnType: Type | null): string {
    if (returnType?.isExpressibleInPhp()) returnType = null
    let nonExpressibleParams = params.filter((p) => !p.isExpressibleInPhp())
    if (nonExpressibleParams.length === 0) return ''
    return (
      [
        '/**',
        ...nonExpressibleParams.map(
          (p) => ` * @param ${p.type?.accept(this)} $${p.name}`,
        ),
        returnType && ` * @return ${returnType.accept(this)}`,
        ' */',
      ]
        .filter(Boolean)
        .join('\n') + '\n'
    )
  }

  visitGetExpr(node: nodes.Get): string {
    throw new Error('Method not implemented.')
  }
  visitGrouping(node: nodes.Grouping): string {
    throw new Error('Method not implemented.')
  }

  visitIdentifier(node: nodes.Identifier): string {
    // TODO need to add $ in some cases and not in others, meaning we need to know if it's a variable or a function. scope resolution, etc
    return `${node.name}`
  }

  visitIf(node: nodes.If): string {
    throw new Error('Method not implemented.')
  }
  visitMatchArm(node: nodes.MatchArm): string {
    throw new Error('Method not implemented.')
  }
  visitMatch(node: nodes.Match): string {
    throw new Error('Method not implemented.')
  }
  visitNew(node: nodes.New): string {
    throw new Error('Method not implemented.')
  }
  visitNullLiteral(node: nodes.NullLiteral): string {
    throw new Error('Method not implemented.')
  }
  visitNumberLiteral(node: nodes.NumberLiteral): string {
    return node.value
  }
  visitOptionalGet(node: nodes.OptionalGet): string {
    throw new Error('Method not implemented.')
  }

  visitParam(node: nodes.Param): string {
    let type = node.type ? `${node.type.simplify().accept(this)} ` : ''
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : ''
    return `${type}$${node.name}${init}`
  }

  visitPostfix(node: nodes.Postfix): string {
    throw new Error('Method not implemented.')
  }
  visitPrefix(node: nodes.Prefix): string {
    throw new Error('Method not implemented.')
  }
  visitReturn(node: nodes.Return): string {
    let value = node.value ? ' ' + node.value.accept(this) : ''
    return `return${value};`
  }
  visitStringLiteral(node: nodes.StringLiteral): string {
    return `"${node.value}"`
  }
  visitSuper(): string {
    throw new Error('Method not implemented.')
  }
  visitTernary(node: nodes.Ternary): string {
    throw new Error('Method not implemented.')
  }
  visitThis(): string {
    throw new Error('Method not implemented.')
  }
  visitThrowExpression(node: nodes.ThrowExpression): string {
    throw new Error('Method not implemented.')
  }
  visitThrowStatement(node: nodes.ThrowStatement): string {
    throw new Error('Method not implemented.')
  }
  visitTry(node: nodes.Try): string {
    throw new Error('Method not implemented.')
  }
  visitUnary(node: nodes.Unary): string {
    throw new Error('Method not implemented.')
  }

  visitVarDeclaration(node: nodes.VarDeclaration): string {
    let type = node.type
      ? `/** @var ${node.type.accept(this)} $${node.name} */\n`
      : ''
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : ''
    return `${type}$${node.name}${init};`
  }

  visitWhile(node: nodes.While): string {
    throw new Error('Method not implemented.')
  }
}