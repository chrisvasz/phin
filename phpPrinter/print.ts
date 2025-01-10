import { EnvironmentKind } from '../parser/environment'
import * as nodes from '../nodes'
import * as types from '../types'
import { Type } from '../types'
import { runtime } from '../parser/globalEnvironment'

export class PrintError extends Error {}

class Line {
  constructor(
    public content: string,
    public indent: number,
  ) {}
}

export class PhpPrinter implements nodes.Visitor<void>, types.Visitor<void> {
  private currentIndent = 0
  private phinRuntimeFunctionsUsed = new Set<string>()

  private currentLine: Line | null = null
  private lines: Line[] = []

  constructor(private readonly leadingWhitespace: string = '  ') {}

  print(node: nodes.Program): string {
    this.currentIndent = 0
    this.currentLine = new Line('', this.currentIndent)
    this.lines = []
    this.phinRuntimeFunctionsUsed.clear()
    node.accept(this)
    for (let name of this.phinRuntimeFunctionsUsed) {
      runtime[name]?.().accept(this) ?? ''
    }
    return this.lines
      .map((l) => this.leadingWhitespace.repeat(l.indent) + l.content)
      .join('\n')
  }

  private append(content: string) {
    if (this.currentLine == null) {
      this.currentLine = new Line('', this.currentIndent)
    }
    this.currentLine.content += content
  }

  private commit(content: string = '') {
    if (content) this.append(content)
    if (this.currentLine) this.lines.push(this.currentLine)
    this.currentLine = null
  }

  private indent(fn: () => void) {
    this.currentIndent++
    fn()
    this.currentIndent--
  }

  private commaSeparate(elements: nodes.Node[] | types.Type[]) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].accept(this)
      if (i < elements.length - 1) this.append(', ')
    }
  }

  /////////////////////////////
  // TYPES
  /////////////////////////////

  visitBooleanType = () => this.append('bool')
  visitFalseType = () => this.append('false')
  visitFloatType = () => this.append('float')
  visitIntType = () => this.append('int')
  visitNullType = () => this.append('null')
  visitNumberType = () => this.append('number')
  visitStringType = () => this.append('string')
  visitTrueType = () => this.append('true')

  visitIdentifierType(identifier: types.Identifier): void {
    this.append(identifier.name)
    if (identifier.generics.length > 0) {
      this.append('<')
      this.commaSeparate(identifier.generics)
      this.append('>')
    }
  }

  visitIntersectionType(intersection: types.Intersection): void {
    for (let i = 0; i < intersection.types.length; i++) {
      intersection.types[i].accept(this)
      if (i < intersection.types.length - 1) this.append('&')
    }
  }

  visitNullableType(nullable: types.Nullable): void {
    this.append('?')
    nullable.type.accept(this)
  }

  visitNumberLiteralType(numberLiteral: types.NumberLiteral): void {
    throw new Error('Method not implemented.')
  }

  visitStringLiteralType(stringLiteral: types.StringLiteral): void {
    throw new Error('Method not implemented.')
  }

  visitUnionType(union: types.Union): void {
    for (let i = 0; i < union.types.length; i++) {
      union.types[i].accept(this)
      if (i < union.types.length - 1) this.append('|')
    }
  }

  /////////////////////////////
  // STATEMENTS
  /////////////////////////////

  visitArrayElement(node: nodes.ArrayElement): void {
    if (node.key != null) {
      node.key.accept(this)
      this.append(' => ')
    }
    node.value.accept(this)
  }

  visitArrayLiteral(node: nodes.ArrayLiteral): void {
    this.append('[')
    this.commaSeparate(node.elements)
    this.append(']')
  }

  visitArrayAccess(node: nodes.ArrayAccess): void {
    node.left.accept(this)
    this.append('[')
    node.index.accept(this)
    this.append(']')
  }

  visitAssign(node: nodes.Assign): void {
    node.name.accept(this)
    let operator = node.operator === '+.=' ? '.=' : node.operator
    this.append(` ${operator} `)
    node.value.accept(this)
  }

  visitBinary(node: nodes.Binary): void {
    node.left.accept(this)
    let operator = node.operator === '+.' ? '.' : node.operator
    this.append(` ${operator} `)
    node.right.accept(this)
  }

  visitBlock(node: nodes.Block): void {
    this.append('{')
    if (node.statements.length === 0) {
      return this.append('}')
    }
    this.commit()
    this.indent(() => {
      for (let s of node.statements) {
        s.accept(this)
      }
    })
    this.append('}')
  }

  visitBooleanLiteral(node: nodes.BooleanLiteral): void {
    this.append(node.value ? 'true' : 'false')
  }

  visitCall(node: nodes.Call): void {
    node.callee.accept(this)
    this.append('(')
    this.commaSeparate(node.args)
    this.append(')')
  }

  visitCatch(node: nodes.Catch): void {
    throw new Error('Method not implemented.')
  }

  /////////////////////////////
  // CLASSES
  /////////////////////////////

  visitClassConst(node: nodes.ClassConst): void {
    // TODO final, abstract, static, docblock
    if (node.visibility) this.append(`${node.visibility} `)
    this.append(`const ${node.name} = `)
    node.initializer.accept(this)
    this.append(';')
  }

  visitClassInitializer(node: nodes.ClassInitializer): void {
    node.body.statements.forEach((s) => s.accept(this))
  }

  visitClassAbstractMethod(node: nodes.ClassAbstractMethod): void {
    this.functionDocblock(node.params, node.returnType)
    this.append(`abstract function ${node.name}(`)
    this.commaSeparate(node.params)
    this.append(')')
    this.typeAnnotation(node.returnType)
    this.append(';')
  }

  visitClassMethod(node: nodes.ClassMethod): void {
    this.functionDocblock(node.params, node.returnType)
    this.append(`function ${node.name}(`)
    this.commaSeparate(node.params)
    this.append(')')
    this.typeAnnotation(node.returnType)
    this.append(' ')
    this.functionBody(node.body)
  }

  visitClassProperty(node: nodes.ClassProperty): void {
    // TODO abstract, static, docblock
    if (node.isFinal) this.append('final ')
    this.append(`${node.visibility ?? 'public'} `)
    if (node.isReadonly) this.append('readonly ')
    if (node.type != null) {
      node.type.simplify().accept(this)
      this.append(' ')
    }
    this.append(`$${node.name};`)
  }

  visitClassDeclaration(node: nodes.ClassDeclaration): void {
    if (node.isAbstract) this.append('abstract ')
    this.append(`class ${node.name} `)
    this.classExtends(node)
    this.classImplements(node)
    this.commit('{')
    this.indent(() => {
      this.classConstructor(node)
      if (node.iterates) this.classGetIterator(node)
      for (let member of node.members) {
        if (!(member instanceof nodes.ClassInitializer)) {
          member.accept(this)
          this.commit()
        }
      }
    })
    this.commit('}')
  }

  private classExtends(node: nodes.ClassDeclaration): void {
    if (node.superclass) {
      this.append('extends ')
      node.superclass.accept(this)
      this.append(' ')
    }
  }

  private classImplements(node: nodes.ClassDeclaration): void {
    let interfaces = node.interfaces
    if (node.iterates) interfaces = [...interfaces, 'IteratorAggregate']
    if (interfaces.length === 0) return
    this.append(`implements ${interfaces.join(', ')} `)
  }

  private classGetIterator(node: nodes.ClassDeclaration): void {
    if (!node.iterates) return
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
    method.accept(this)
    this.commit()
  }

  private classConstructor(node: nodes.ClassDeclaration): void {
    let propsWithInitializers = node.members
      .filter((p) => p instanceof nodes.ClassProperty)
      .filter((p) => p.initializer != null)
    let visibility = node.constructorVisibility ?? 'public'
    let classInitializers = node.members.filter(
      (m) => m instanceof nodes.ClassInitializer,
    )
    if (node.params.length === 0)
      if (propsWithInitializers.length === 0)
        if (visibility === 'public') if (classInitializers.length === 0) return
    this.functionDocblock(node.params, null)
    if (visibility !== 'public') {
      this.append(`${visibility} `)
    }
    this.append(`function __construct(`)
    this.classParams(node.params)
    this.append(') {')
    if (propsWithInitializers.length === 0)
      if (classInitializers.length === 0) {
        return this.commit('}')
      }
    this.commit()
    this.indent(() => {
      for (let prop of propsWithInitializers) {
        this.append(`$this->${prop.name} = `)
        prop.initializer!.accept(this)
        this.commit(';')
      }
      classInitializers.forEach((i) => i.accept(this))
    })
    this.commit('}')
  }

  private classParams(params: Array<nodes.Param | nodes.ClassProperty>): void {
    for (let i = 0; i < params.length; i++) {
      let param = params[i]
      if (param instanceof nodes.Param) {
        param.accept(this)
      } else if (param instanceof nodes.ClassProperty) {
        this.classConstructorPromotedProperty(param)
      }
      if (i < params.length - 1) this.append(', ')
    }
  }

  // TODO reuse visitClassProperty?
  private classConstructorPromotedProperty(node: nodes.ClassProperty): void {
    if (node.isFinal) this.append('final ')
    this.append(`${node.visibility ?? 'public'} `)
    if (node.isReadonly) this.append('readonly ')
    if (node.type != null) {
      node.type.simplify().accept(this)
      this.append(' ')
    }
    this.append(`$${node.name}`)
  }

  visitClassSuperclass(node: nodes.ClassSuperclass): void {
    this.append(node.name)
  }

  visitClone(node: nodes.Clone): void {
    this.append('clone ')
    node.expression.accept(this)
  }

  /////////////////////////////
  // END CLASSES
  /////////////////////////////

  visitDestructuring(node: nodes.Destructuring): void {
    this.append('[')
    for (let i = 0; i < node.elements.length; i++) {
      let element = node.elements[i]
      element?.accept(this)
      if (i < node.elements.length - 1) this.append(', ')
    }
    this.append(']')
  }

  visitDestructuringElement(node: nodes.DestructuringElement): void {
    if (node.key != null) {
      this.append(`'${node.key}' => `)
    }
    this.append(`$${node.value}`)
  }

  visitEcho(node: nodes.Echo): void {
    this.append('echo ')
    node.expression.accept(this)
    this.commit(';')
  }

  visitExpressionStatement(node: nodes.ExpressionStatement): void {
    node.expression.accept(this)
    this.commit(';')
  }

  visitForeach(node: nodes.Foreach): void {
    this.append('foreach (')
    node.iterable.accept(this)
    this.append(' as ')
    if (node.key) {
      node.key.accept(this)
      this.append(` => `)
    }
    node.value.accept(this)
    this.append(') ')
    node.body.accept(this)
  }

  visitForeachVariable(node: nodes.ForeachVariable): void {
    // TODO output var comment for type
    this.append(`$${node.name}`)
  }

  visitFor(node: nodes.For): void {
    throw new Error('Method not implemented.')
  }

  visitFunctionExpression(node: nodes.FunctionExpression): void {
    this.append('function (')
    this.commaSeparate(node.params)
    this.append(')')
    this.typeAnnotation(node.returnType)
    this.append(' ')
    this.functionUse(node.closureVariables)
    this.functionBody(node.body)
  }

  visitFunctionDeclaration(node: nodes.FunctionDeclaration): void {
    this.functionDocblock(node.params, node.returnType)
    this.append(`function ${node.name}(`)
    this.commaSeparate(node.params)
    this.append(')')
    this.typeAnnotation(node.returnType?.simplify())
    this.append(' ')
    this.functionBody(node.body)
    this.commit()
  }

  private functionBody(body: nodes.FunctionDeclaration['body']): void {
    if (body instanceof nodes.Block) {
      return body.accept(this)
    }
    this.commit('{')
    this.indent(() => {
      this.append(`return `)
      body.accept(this)
      this.commit(';')
    })
    this.append('}')
  }

  private functionUse(
    closureVariables: nodes.FunctionExpression['closureVariables'],
  ): void {
    if (!closureVariables.length) return
    this.append(`use (${closureVariables.map((v) => '$' + v).join(', ')}) `)
  }

  functionDocblock(
    params: Array<{ name: string; type: Type | null }>,
    returnType: Type | null,
  ): void {
    if (returnType?.isExpressibleInPhp()) returnType = null
    let nonExpressibleParams = params.filter(
      (p) => p.type?.isExpressibleInPhp() === false,
    )
    if (nonExpressibleParams.length === 0) return
    this.commit('/**')
    for (let param of nonExpressibleParams) {
      if (param.type == null) continue
      this.append(' * @param ')
      param.type?.accept(this)
      this.commit(` $${param.name}`)
    }
    if (returnType) {
      this.append(' * @return ')
      returnType.accept(this)
      this.commit()
    }
    this.commit(' */')
  }

  visitGetExpr(node: nodes.Get): void {
    node.object.accept(this)
    this.append(`->${node.name}`)
  }

  visitGrouping(node: nodes.Grouping): void {
    this.append('(')
    node.expression.accept(this)
    this.append(')')
  }

  visitIdentifier(node: nodes.Identifier): void {
    let kind = node.kind!
    if (kind === EnvironmentKind.Variable) {
      return this.append(`$${node.name}`)
    }
    if (kind === EnvironmentKind.ClosureVariable) {
      return this.append(`$${node.name}`)
    }
    if (kind === EnvironmentKind.ClassProperty) {
      return this.append(`$this->${node.name}`)
    }
    if (kind === EnvironmentKind.ClassMethod) {
      return this.append(`$this->${node.name}`)
    }
    if (kind === EnvironmentKind.ClassConst) {
      return this.append(`self::${node.name}`)
    }
    if (kind === EnvironmentKind.PhinRuntimeFunction) {
      this.phinRuntimeFunctionsUsed.add(node.name)
    }
    return this.append(`${node.name}`)
  }

  visitIf(node: nodes.If): void {
    this.append('if (')
    node.condition.accept(this)
    this.append(') ')
    node.thenBranch.accept(this)
    if (node.elseBranch) {
      this.append(' else ')
      node.elseBranch.accept(this)
    }
    this.commit()
  }

  visitMatch(node: nodes.Match): void {
    this.append('match (')
    node.subject.accept(this)
    this.append(') {')
    if (node.arms.length === 0 && !node.defaultArm) {
      return this.append('}')
    }
    this.indent(() => {
      this.commit()
      for (let arm of node.arms) {
        arm.accept(this)
        this.commit(',')
      }
      if (node.defaultArm) {
        this.append('default => ')
        node.defaultArm.accept(this)
        this.commit(',')
      }
    })
    this.append('}')
  }

  visitMatchArm(node: nodes.MatchArm): void {
    this.commaSeparate(node.patterns)
    this.append(' => ')
    node.body.accept(this)
  }

  visitNew(node: nodes.New): void {
    this.append('new ')
    node.expression.accept(this)
  }

  visitNullLiteral(node: nodes.NullLiteral): void {
    this.append('null')
  }

  visitNumberLiteral(node: nodes.NumberLiteral): void {
    this.append(node.value)
  }

  visitOptionalGet(node: nodes.OptionalGet): void {
    throw new Error('Method not implemented.')
  }

  visitParam(node: nodes.Param): void {
    if (node.type != null) {
      node.type.simplify().accept(this)
      this.append(' ')
    }
    this.append(`$${node.name}`)
    if (node.initializer) {
      this.append(' = ')
      node.initializer.accept(this)
    }
  }

  visitPipeline(node: nodes.Pipeline): void {
    node.right.accept(this)
    this.append('(')
    node.left.accept(this)
    this.append(')')
  }

  visitPostfix(node: nodes.Postfix): void {
    node.left.accept(this)
    this.append(node.operator)
  }

  visitPrefix(node: nodes.Prefix): void {
    throw new Error('Method not implemented.')
  }

  visitProgram(node: nodes.Program): void {
    node.statements.map((s) => s.accept(this))
    this.commit()
  }

  visitReturn(node: nodes.Return): void {
    this.append('return ')
    if (node.value != null) node.value.accept(this)
    this.commit(';')
  }

  visitScopeResolution(node: nodes.ScopeResolution): void {
    node.left.accept(this)
    this.append(`::${node.right}`)
  }

  visitStringLiteral(node: nodes.StringLiteral): void {
    this.append(`"${node.value}"`)
  }

  visitTemplateStringLiteral(node: nodes.TemplateStringLiteral): void {
    if (node.parts.length === 0) return this.append('""')
    this.append('(')
    if (node.parts.length === 1) {
      if (!(node.parts[0] instanceof nodes.StringLiteral)) {
        this.append('"" . ')
      }
    }
    for (let i = 0; i < node.parts.length; i++) {
      node.parts[i].accept(this)
      if (i < node.parts.length - 1) this.append(' . ')
    }
    this.append(')')
  }

  visitSuper(): void {
    this.append('super')
  }

  visitTernary(node: nodes.Ternary): void {
    let { condition, left, right } = node
    condition.accept(this)
    this.append(' ? ')
    left.accept(this)
    this.append(' : ')
    right.accept(this)
  }

  visitThis(): void {
    this.append('$this')
  }

  visitThrowExpression(node: nodes.ThrowExpression): void {
    this.append('throw ')
    node.expression.accept(this)
  }

  visitThrowStatement(node: nodes.ThrowStatement): void {
    this.append('throw ')
    node.expression.accept(this)
    this.commit(';')
  }

  visitTry(node: nodes.Try): void {
    throw new Error('Method not implemented.')
  }

  visitUnary(node: nodes.Unary): void {
    throw new Error('Method not implemented.')
  }

  visitVarDeclaration(node: nodes.VarDeclaration): void {
    if (node.type != null) {
      this.typeAnnotationViaComment(node.type, node.name)
    }
    this.append(`$${node.name}`)
    if (node.initializer) {
      this.append(' = ')
      node.initializer.accept(this)
    }
    this.commit(';')
  }

  visitVarDestructuringDeclaration(
    node: nodes.VarDestructuringDeclaration,
  ): void {
    node.destructuring.accept(this)
    this.append(' = ')
    node.initializer.accept(this)
    this.commit(';')
  }

  visitWhile(node: nodes.While): void {
    throw new Error('Method not implemented.')
  }

  typeAnnotation(type: Type | null | undefined): void {
    if (type == null) return
    this.append(': ')
    type.accept(this)
  }

  typeAnnotationViaComment(type: Type | null, name: string): void {
    if (type == null) return
    this.append(`/** @var `)
    type.accept(this)
    this.commit(` $${name} */`)
  }
}
