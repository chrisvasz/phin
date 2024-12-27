import * as nodes from '../nodes'
import * as types from '../types'
import { Type } from '../types'
import { Environment, Kind } from './environment'

export class PrintError extends Error {}

function defaultResolveUnknownIdentifier(name: string): Kind {
  throw new PrintError(`Unknown identifier ${name}`)
}

export class PhpPrinter
  implements nodes.Visitor<string>, types.Visitor<string>
{
  constructor(
    private readonly resolveUnknownIdentifier: (
      name: string,
    ) => Kind = defaultResolveUnknownIdentifier,
    private readonly leadingWhitespace: string = '  ',
  ) {}

  private currentIndent = 0
  private environment = new Environment(null)

  print(statements: nodes.Node[]): string {
    return this.encloseWith(statements, () => {
      return statements.map((s) => s.accept(this)).join('\n')
    })
  }

  private indentBlock(fn: () => string[]): string {
    this.currentIndent++
    let result = fn().map((s) => this.indent(s))
    this.currentIndent--
    return result.join('\n')
  }

  private indent(content: string): string {
    return this.leadingWhitespace.repeat(this.currentIndent) + content
  }

  private encloseWith<T>(nodes: nodes.Node[], fn: () => T): T {
    let current = this.environment
    this.environment = new Environment(current, nodes)
    let result = fn()
    this.environment = current
    return result
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
    return this.encloseWith(node.statements, () => {
      let body = this.indentBlock(() =>
        node.statements.map((s) => s.accept(this)),
      )
      return ['{', body, this.indent('}')].join('\n')
    })
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

  /////////////////////////////
  // CLASSES
  /////////////////////////////

  visitClassConst(node: nodes.ClassConst): string {
    throw new Error('Method not implemented.')
  }
  visitClassInitializer(node: nodes.ClassInitializer): string {
    throw new Error('Method not implemented.')
  }

  visitClassMethod(node: nodes.ClassMethod): string {
    let params = node.params.map((p) => p.accept(this)).join(', ')
    let type = node.returnType
      ? `: ${node.returnType.simplify().accept(this)}`
      : ''
    let body = this.classMethodBody(node.body)
    let result = `function ${node.name}(${params})${type} ${body}`
    let docblock = this.functionDocblock(node.params, node.returnType)
    return `${docblock}${result}`
  }

  classMethodBody(body: nodes.ClassMethod['body']) {
    let result = body.accept(this)
    if (body instanceof nodes.Block) return result
    return [
      '{',
      this.indentBlock(() => [`return ${result};`]),
      this.indent('}'),
    ].join('\n')
  }

  visitClassParam(node: nodes.ClassParam): string {
    return `private readonly $${node.name}`
  }

  visitClassProperty(node: nodes.ClassProperty): string {
    let type = node.type
      ? `/** @var ${node.type.accept(this)} $${node.name} */\n`
      : ''
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : ''
    return `${type}$${node.name}${init};`
  }

  visitClassDeclaration(node: nodes.ClassDeclaration): string {
    return this.encloseWith([...node.params, ...node.members], () => {
      let declaration = `class ${node.name} {`
      let body = this.indentBlock(() => {
        let constructor = this.classConstructor(node)
        if (node.members.length === 0 && !constructor) return []
        let members = node.members.map((m) => m.accept(this))
        if (constructor) members.unshift(constructor)
        return members
      })
      if (body === '') return declaration + '}'
      return [this.indent(declaration), body, this.indent('}')].join('\n')
    })
  }

  classConstructor(node: nodes.ClassDeclaration): string {
    if (node.params.length === 0) return ''
    let params = node.params.map((p) => p.accept(this)).join(', ')
    return `public function __construct(${params}) {}`
  }

  visitClassSuperclass(node: nodes.ClassSuperclass): string {
    throw new Error('Method not implemented.')
  }
  visitClone(node: nodes.Clone): string {
    throw new Error('Method not implemented.')
  }

  /////////////////////////////
  // END CLASSES
  /////////////////////////////

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
    let body = this.functionBody(node.body)
    let result = `function (${params})${type} ${body}`
    return `${result}`
  }

  visitFunctionDeclaration(node: nodes.FunctionDeclaration): string {
    this.environment.add(node.name, Kind.Function)
    let params = node.params.map((p) => p.accept(this)).join(', ')
    let type = node.returnType
      ? `: ${node.returnType.simplify().accept(this)}`
      : ''
    let body = this.functionBody(node.body)
    let result = `function ${node.name}(${params})${type} ${body}`
    let docblock = this.functionDocblock(node.params, node.returnType)
    return `${docblock}${result}`
  }

  functionBody(body: nodes.FunctionDeclaration['body']) {
    let result = body.accept(this)
    if (body instanceof nodes.Block) return result
    return [
      '{',
      this.indentBlock(() => [`return ${result};`]),
      this.indent('}'),
    ].join('\n')
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
        .map((line) => this.indent(line ?? ''))
        .join('\n') + '\n'
    )
  }

  visitGetExpr(node: nodes.Get): string {
    return `${node.object.accept(this)}->${node.name}`
  }
  visitGrouping(node: nodes.Grouping): string {
    throw new Error('Method not implemented.')
  }

  visitIdentifier(node: nodes.Identifier): string {
    let kind =
      this.environment.get(node.name) ??
      this.resolveUnknownIdentifier(node.name)
    if (kind === Kind.Var) return `$${node.name}`
    if (kind === Kind.ClassProperty) return `$this->${node.name}`
    if (kind === Kind.ClassMethod) return `$this->${node.name}`
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
    return `new ${node.expression.accept(this)}`
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
    return 'super'
  }
  visitTernary(node: nodes.Ternary): string {
    throw new Error('Method not implemented.')
  }
  visitThis(): string {
    return '$this'
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
    this.environment.add(node.name, Kind.Var)
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
