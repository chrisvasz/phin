import * as nodes from '../nodes';
import * as types from '../types';

const tab = '  ';

export class PhpPrinter
  implements nodes.Visitor<string>, types.Visitor<string>
{
  currentIndent = 0;

  print(statements: nodes.Node[]): string {
    let result = '';
    for (let s of statements) {
      result += s.accept(this);
    }
    return result;
  }

  indent(content: string | string[]): string {
    if (typeof content === 'string')
      return tab.repeat(this.currentIndent) + content;
    return content.map(c => tab.repeat(this.currentIndent) + c).join('\n');
  }

  /////////////////////////////
  // TYPES
  /////////////////////////////

  visitBooleanType(boolean: types.Boolean): string {
    throw new Error('Method not implemented.');
  }
  visitFalseType(false_: types.False): string {
    throw new Error('Method not implemented.');
  }
  visitFloatType(float: types.Float): string {
    throw new Error('Method not implemented.');
  }
  visitIdentifierType(identifier: types.Identifier): string {
    throw new Error('Method not implemented.');
  }
  visitIntersectionType(intersection: types.Intersection): string {
    throw new Error('Method not implemented.');
  }
  visitIntType(int: types.Int): string {
    return 'int';
  }
  visitNullableType(nullable: types.Nullable): string {
    throw new Error('Method not implemented.');
  }
  visitNullType(null_: types.Null): string {
    throw new Error('Method not implemented.');
  }
  visitNumberLiteralType(numberLiteral: types.NumberLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitNumberType(number: types.Number): string {
    return 'number';
  }
  visitStringLiteralType(stringLiteral: types.StringLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitStringType(string: types.String): string {
    throw new Error('Method not implemented.');
  }
  visitTrueType(true_: types.True): string {
    throw new Error('Method not implemented.');
  }
  visitUnionType(union: types.Union): string {
    throw new Error('Method not implemented.');
  }

  /////////////////////////////
  // STATEMENTS
  /////////////////////////////

  visitClassAbstractMethod(node: nodes.ClassAbstractMethod): string {
    throw new Error('Method not implemented.');
  }
  visitArrayElement(node: nodes.ArrayElement): string {
    throw new Error('Method not implemented.');
  }
  visitArrayLiteral(node: nodes.ArrayLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitAssign(node: nodes.Assign): string {
    throw new Error('Method not implemented.');
  }
  visitBinary(node: nodes.Binary): string {
    let left = node.left.accept(this);
    let right = node.right.accept(this);
    return `${left} ${node.operator} ${right}`;
  }

  visitBlock(node: nodes.Block): string {
    if (node.statements.length === 0) return '{}';
    let lines = node.statements.map(s => s.accept(this));
    return `{\n${this.indent(lines)}\n}`;
  }

  visitBooleanLiteral(node: nodes.BooleanLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitCall(node: nodes.Call): string {
    throw new Error('Method not implemented.');
  }
  visitCatch(node: nodes.Catch): string {
    throw new Error('Method not implemented.');
  }
  visitClassConst(node: nodes.ClassConst): string {
    throw new Error('Method not implemented.');
  }
  visitClassInitializer(node: nodes.ClassInitializer): string {
    throw new Error('Method not implemented.');
  }
  visitClassMethod(node: nodes.ClassMethod): string {
    throw new Error('Method not implemented.');
  }
  visitClassParam(node: nodes.ClassParam): string {
    throw new Error('Method not implemented.');
  }
  visitClassProperty(node: nodes.ClassProperty): string {
    throw new Error('Method not implemented.');
  }
  visitClassDeclaration(node: nodes.ClassDeclaration): string {
    throw new Error('Method not implemented.');
  }
  visitClassSuperclass(node: nodes.ClassSuperclass): string {
    throw new Error('Method not implemented.');
  }
  visitClone(node: nodes.Clone): string {
    throw new Error('Method not implemented.');
  }
  visitEcho(node: nodes.Echo): string {
    return `echo ${node.expression.accept(this)};`;
  }
  visitExpressionStatement(node: nodes.ExpressionStatement): string {
    throw new Error('Method not implemented.');
  }
  visitForeach(node: nodes.Foreach): string {
    throw new Error('Method not implemented.');
  }
  visitFor(node: nodes.For): string {
    throw new Error('Method not implemented.');
  }
  visitFunctionExpression(node: nodes.FunctionExpression): string {
    throw new Error('Method not implemented.');
  }

  visitParam(node: nodes.Param): string {
    let type = node.type ? `${node.type.accept(this)} ` : '';
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : '';
    return `${type}$${node.name}${init}`;
  }

  visitFunctionDeclaration(node: nodes.FunctionDeclaration): string {
    let params = node.params.map(p => p.accept(this));
    let type = node.returnType ? `: ${node.returnType.accept(this)}` : '';
    let body = node.body.accept(this);
    let result = `function ${node.name}(${params})${type} ${body}`;
    return result;
  }

  visitGetExpr(node: nodes.Get): string {
    throw new Error('Method not implemented.');
  }
  visitGrouping(node: nodes.Grouping): string {
    throw new Error('Method not implemented.');
  }
  visitIdentifier(node: nodes.Identifier): string {
    throw new Error('Method not implemented.');
  }
  visitIf(node: nodes.If): string {
    throw new Error('Method not implemented.');
  }
  visitMatchArm(node: nodes.MatchArm): string {
    throw new Error('Method not implemented.');
  }
  visitMatch(node: nodes.Match): string {
    throw new Error('Method not implemented.');
  }
  visitNew(node: nodes.New): string {
    throw new Error('Method not implemented.');
  }
  visitNullLiteral(node: nodes.NullLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitNumberLiteral(node: nodes.NumberLiteral): string {
    return node.value;
  }
  visitOptionalGet(node: nodes.OptionalGet): string {
    throw new Error('Method not implemented.');
  }
  visitPostfix(node: nodes.Postfix): string {
    throw new Error('Method not implemented.');
  }
  visitPrefix(node: nodes.Prefix): string {
    throw new Error('Method not implemented.');
  }
  visitReturn(node: nodes.Return): string {
    let value = node.value ? ' ' + node.value.accept(this) : '';
    return `return${value};`;
  }
  visitStringLiteral(node: nodes.StringLiteral): string {
    return `"${node.value}"`;
  }
  visitSuper(): string {
    throw new Error('Method not implemented.');
  }
  visitTernary(node: nodes.Ternary): string {
    throw new Error('Method not implemented.');
  }
  visitThis(): string {
    throw new Error('Method not implemented.');
  }
  visitThrowExpression(node: nodes.ThrowExpression): string {
    throw new Error('Method not implemented.');
  }
  visitThrowStatement(node: nodes.ThrowStatement): string {
    throw new Error('Method not implemented.');
  }
  visitTry(node: nodes.Try): string {
    throw new Error('Method not implemented.');
  }
  visitUnary(node: nodes.Unary): string {
    throw new Error('Method not implemented.');
  }
  visitVarDeclaration(node: nodes.VarDeclaration): string {
    let type = node.type
      ? `/** @var ${node.type.accept(this)} $${node.name} */\n`
      : '';
    let init = node.initializer ? ` = ${node.initializer.accept(this)}` : '';
    return `${type}$${node.name}${init};`;
  }
  visitWhile(node: nodes.While): string {
    throw new Error('Method not implemented.');
  }
}
