import { EnvironmentKind } from '../parser/environment'
import * as nodes from '../nodes'
import * as types from '../types'
import { Type } from '../types'

export class PrintError extends Error {}

export class PhpPrinter
  implements nodes.Visitor<string>, types.Visitor<string>
{
  private currentIndent = 0
  constructor(private readonly leadingWhitespace: string = '  ') {}

  print(node: nodes.Program): string {
    return node.accept(this)
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

  visitArrayElement(node: nodes.ArrayElement): string {
    let value = node.value.accept(this)
    if (!node.key) return value
    let key = node.key.accept(this)
    return `${key} => ${value}`
  }

  visitArrayLiteral(node: nodes.ArrayLiteral): string {
    let elements = node.elements.map((e) => e.accept(this)).join(', ')
    return `[${elements}]`
  }

  visitArrayAccess(node: nodes.ArrayAccess): string {
    return `${node.left.accept(this)}[${node.index.accept(this)}]`
  }

  visitAssign(node: nodes.Assign): string {
    let operator = node.operator === '+.=' ? '.=' : node.operator
    return `${node.name.accept(this)} ${operator} ${node.value.accept(this)}`
  }

  visitBinary(node: nodes.Binary): string {
    let left = node.left.accept(this)
    let right = node.right.accept(this)
    let operator = node.operator === '+.' ? '.' : node.operator
    return `${left} ${operator} ${right}`
  }

  visitBlock(node: nodes.Block): string {
    if (node.statements.length === 0) return '{}'
    let body = this.indentBlock(() =>
      node.statements.map((s) => s.accept(this)),
    )
    return ['{', body, this.indent('}')].join('\n')
  }

  visitBooleanLiteral(node: nodes.BooleanLiteral): string {
    return node.value ? 'true' : 'false'
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
    // TODO final, abstract, static, docblock
    let visibility = node.visibility ? `${node.visibility} ` : ''
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : ''
    return `${visibility}const ${node.name}${init};`
  }

  visitClassInitializer(node: nodes.ClassInitializer): string {
    throw new Error('Method not implemented.')
  }

  visitClassAbstractMethod(node: nodes.ClassAbstractMethod): string {
    let params = this.functionParams(node.params)
    let type = this.typeAnnotation(node.returnType)
    let result = `abstract function ${node.name}(${params})${type};`
    let docblock = this.functionDocblock(node.params, node.returnType)
    return `${docblock}${result}`
  }

  visitClassMethod(node: nodes.ClassMethod): string {
    // TODO visibility, final, abstract, static
    let params = this.functionParams(node.params)
    let type = this.typeAnnotation(node.returnType)
    let body = this.functionBody(node.body)
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

  visitClassProperty(node: nodes.ClassProperty): string {
    // TODO abstract, static, docblock
    let final = node.isFinal ? 'final ' : ''
    let readonly = node.isReadonly ? 'readonly ' : ''
    let visibility = `${node.visibility ?? 'public'} `
    let type = node.type ? `${node.type.accept(this)} ` : ''
    return `${final}${visibility}${readonly}${type}$${node.name};`
  }

  visitClassDeclaration(node: nodes.ClassDeclaration): string {
    let declaration = [
      node.isAbstract ? 'abstract' : '',
      'class',
      node.name,
      this.classExtends(node),
      this.classImplements(node),
      '{',
    ]
      .filter(Boolean)
      .join(' ')
    let body = this.indentBlock(() => {
      let constructor = this.classConstructor(node)
      if (node.members.length === 0 && !constructor && !node.iterates) return []
      let members = node.members.map((m) => m.accept(this))
      if (node.iterates) members.unshift(this.classGetIterator(node))
      if (constructor) members.unshift(constructor)
      return members
    })
    if (body === '') return declaration + '}'
    return [declaration, body, this.indent('}')].join('\n')
  }

  classExtends(node: nodes.ClassDeclaration): string {
    if (!node.superclass) return ''
    return `extends ${node.superclass.accept(this)}`
  }

  classImplements(node: nodes.ClassDeclaration): string {
    let interfaces = node.interfaces
    if (node.iterates) interfaces = [...interfaces, 'IteratorAggregate']
    if (interfaces.length === 0) return ''
    return `implements ${interfaces.join(', ')}`
  }

  classGetIterator(node: nodes.ClassDeclaration): string {
    if (!node.iterates) return ''
    let method = new nodes.ClassMethod(
      false,
      null,
      false,
      'getIterator',
      [],
      new types.Identifier('Traversable', []),
      new nodes.New(
        new nodes.Call(new nodes.Identifier('ArrayIterator'), [node.iterates]),
      ),
    )
    return method.accept(this)
  }

  classConstructor(node: nodes.ClassDeclaration): string {
    let { params, constructorVisibility } = node
    let visibility = constructorVisibility ? `${constructorVisibility} ` : ''
    let propertiesWithInitializers = node
      .properties()
      .filter((p) => p.initializer) // TODO only non compile time constants
    if (!params.length && !visibility && !propertiesWithInitializers.length)
      return ''
    let declaration = `${visibility}function __construct(${this.classParams(params)}) {`
    if (!propertiesWithInitializers.length) return declaration + '}'
    return (
      declaration +
      '\n' +
      this.indentBlock(() =>
        propertiesWithInitializers.map(
          (p) => `$this->${p.name} = ${p.initializer?.accept(this)};`,
        ),
      ) +
      '\n' +
      this.indent('}')
    )
  }

  classParams(params: Array<nodes.Param | nodes.ClassProperty>): string {
    return params
      .map((p) => {
        let result = p.accept(this)
        if (p instanceof nodes.ClassProperty) {
          result = result.slice(0, -1) // remove semicolon
        }
        return result
      })
      .join(', ')
  }

  visitClassSuperclass(node: nodes.ClassSuperclass): string {
    return node.name
  }

  visitClone(node: nodes.Clone): string {
    throw new Error('Method not implemented.')
  }

  /////////////////////////////
  // END CLASSES
  /////////////////////////////

  visitDestructuring(node: nodes.Destructuring): string {
    return `[${node.elements.map((e) => e?.accept(this)).join(', ')}]`
  }

  visitDestructuringElement(node: nodes.DestructuringElement): string {
    // TODO print type somewhere
    let key = node.key ? `'${node.key}' => ` : '' // TODO single quote or double quote?
    let value = `$${node.value}`
    return key + value
  }

  visitEcho(node: nodes.Echo): string {
    return `echo ${node.expression.accept(this)};`
  }

  visitExpressionStatement(node: nodes.ExpressionStatement): string {
    return node.expression.accept(this) + ';'
  }

  visitForeach(node: nodes.Foreach): string {
    let iterable = node.iterable.accept(this)
    let key = node.key ? `${node.key.accept(this)} => ` : ''
    let value = node.value.accept(this)
    let result = `foreach (${iterable} as ${key}${value}) `
    let body = node.body.accept(this)
    return result + body
  }

  visitForeachVariable(node: nodes.ForeachVariable): string {
    // TODO output var comment for type
    return `$${node.name}`
  }

  visitFor(node: nodes.For): string {
    throw new Error('Method not implemented.')
  }

  visitFunctionExpression(node: nodes.FunctionExpression): string {
    let params = node.params.map((p) => p.accept(this)).join(', ')
    let type = this.typeAnnotation(node.returnType)
    let use = this.functionUse(node.closureVariables)
    let body = this.functionBody(node.body)
    let result = `function (${params})${type}${use} ${body}`
    return `${result}`
  }

  visitFunctionDeclaration(node: nodes.FunctionDeclaration): string {
    let params = this.functionParams(node.params)
    let type = this.typeAnnotation(node.returnType)
    let body = this.functionBody(node.body)
    let result = `function ${node.name}(${params})${type} ${body}`
    let docblock = this.functionDocblock(node.params, node.returnType)
    return `${docblock}${result}`
  }

  functionParams(params: nodes.Param[]): string {
    return params.map((p) => this.functionParam(p)).join(', ')
  }

  functionParam(param: nodes.Param): string {
    return param.accept(this)
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

  functionUse(closureVariables: nodes.FunctionExpression['closureVariables']) {
    if (!closureVariables.length) return ''
    return ` use (${closureVariables.map((v) => '$' + v).join(', ')})`
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
    return `(${node.expression.accept(this)})`
  }

  visitIdentifier(node: nodes.Identifier): string {
    let kind = node.kind!
    if (kind === EnvironmentKind.Variable) return `$${node.name}`
    if (kind === EnvironmentKind.ClosureVariable) return `$${node.name}`
    if (kind === EnvironmentKind.ClassProperty) return `$this->${node.name}`
    if (kind === EnvironmentKind.ClassMethod) return `$this->${node.name}`
    if (kind === EnvironmentKind.ClassConst) return `self::${node.name}`
    return `${node.name}`
  }

  visitIf(node: nodes.If): string {
    let result = `if (${node.condition.accept(this)}) `
    let thenBranch = node.thenBranch.accept(this)
    let elseBranch = node.elseBranch
      ? ` else ${node.elseBranch.accept(this)}`
      : ''
    return result + thenBranch + elseBranch
  }

  visitMatch(node: nodes.Match): string {
    let subject = node.subject.accept(this)
    let result = `match (${subject}) {`
    if (!node.arms.length && !node.defaultArm) return result + '}'
    let arms = this.indentBlock(() => {
      let result = node.arms.map((a) => a.accept(this))
      if (node.defaultArm) {
        result.push('default => ' + node.defaultArm.accept(this) + ',')
      }
      return result
    })
    return `${result}\n${arms}\n${this.indent('}')}`
  }

  visitMatchArm(node: nodes.MatchArm): string {
    let pattern = node.patterns.map((p) => p.accept(this)).join(', ')
    let body = node.body.accept(this)
    return `${pattern} => ${body},`
  }

  visitNew(node: nodes.New): string {
    return `new ${node.expression.accept(this)}`
  }

  visitNullLiteral(node: nodes.NullLiteral): string {
    return 'null'
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
    return `${node.left.accept(this)}${node.operator}`
  }

  visitPrefix(node: nodes.Prefix): string {
    throw new Error('Method not implemented.')
  }

  visitProgram(node: nodes.Program): string {
    return node.statements.map((s) => s.accept(this)).join('\n') + '\n'
  }

  visitReturn(node: nodes.Return): string {
    let value = node.value ? ' ' + node.value.accept(this) : ''
    return `return${value};`
  }

  visitScopeResolution(node: nodes.ScopeResolution): string {
    return `${node.left.accept(this)}::${node.right}`
  }

  visitStringLiteral(node: nodes.StringLiteral): string {
    return `"${node.value}"`
  }

  visitTemplateStringLiteral(node: nodes.TemplateStringLiteral): string {
    if (node.parts.length === 0) return '""'
    let parts = node.parts.map((p) => p.accept(this))
    if (
      node.parts.length === 1 &&
      !(node.parts[0] instanceof nodes.StringLiteral)
    ) {
      parts.unshift('""')
    }
    if (parts.length <= 1) return parts.join('')
    return `(${parts.join(' . ')})`
  }

  visitSuper(): string {
    return 'super'
  }

  visitTernary(node: nodes.Ternary): string {
    let { condition, left, right } = node
    return `${condition.accept(this)} ? ${left.accept(this)} : ${right.accept(this)}`
  }

  visitThis(): string {
    return '$this'
  }

  visitThrowExpression(node: nodes.ThrowExpression): string {
    return `throw ${node.expression.accept(this)}`
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
    let name = node.name
    let type = ''
    type = this.typeAnnotationViaComment(node.type, name)
    name = `$${name}`
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : ''
    return `${type}${name}${init};`
  }

  visitVarDestructuringDeclaration(
    node: nodes.VarDestructuringDeclaration,
  ): string {
    let destructuring = node.destructuring.accept(this)
    let init = node.initializer.accept(this)
    return `${destructuring} = ${init};`
  }

  visitWhile(node: nodes.While): string {
    throw new Error('Method not implemented.')
  }

  typeAnnotation(type: Type | null): string {
    if (!type) return ''
    return `: ${type.simplify().accept(this)}`
  }

  typeAnnotationViaComment(type: Type | null, name: string): string {
    if (!type) return ''
    return `/** @var ${type.accept(this)} $${name} */\n`
  }
}
