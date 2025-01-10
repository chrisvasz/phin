// token.ts
class Token {
  type;
  lexeme;
  literal;
  line;
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
  toString() {
    return `${TokenType[this.type]} ${this.lexeme}`;
  }
}
var TokenType;
((TokenType2) => {
  TokenType2[TokenType2["LEFT_PAREN"] = 0] = "LEFT_PAREN";
  TokenType2[TokenType2["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
  TokenType2[TokenType2["LEFT_BRACKET"] = 2] = "LEFT_BRACKET";
  TokenType2[TokenType2["RIGHT_BRACKET"] = 3] = "RIGHT_BRACKET";
  TokenType2[TokenType2["LEFT_BRACE"] = 4] = "LEFT_BRACE";
  TokenType2[TokenType2["RIGHT_BRACE"] = 5] = "RIGHT_BRACE";
  TokenType2[TokenType2["COMMA"] = 6] = "COMMA";
  TokenType2[TokenType2["DOT"] = 7] = "DOT";
  TokenType2[TokenType2["COLON"] = 8] = "COLON";
  TokenType2[TokenType2["QUESTION"] = 9] = "QUESTION";
  TokenType2[TokenType2["AMPERSAND"] = 10] = "AMPERSAND";
  TokenType2[TokenType2["PIPE"] = 11] = "PIPE";
  TokenType2[TokenType2["PLUS_DOT"] = 12] = "PLUS_DOT";
  TokenType2[TokenType2["MINUS"] = 13] = "MINUS";
  TokenType2[TokenType2["PLUS"] = 14] = "PLUS";
  TokenType2[TokenType2["SEMICOLON"] = 15] = "SEMICOLON";
  TokenType2[TokenType2["SLASH"] = 16] = "SLASH";
  TokenType2[TokenType2["STAR"] = 17] = "STAR";
  TokenType2[TokenType2["PLUS_PLUS"] = 18] = "PLUS_PLUS";
  TokenType2[TokenType2["MINUS_MINUS"] = 19] = "MINUS_MINUS";
  TokenType2[TokenType2["STAR_STAR"] = 20] = "STAR_STAR";
  TokenType2[TokenType2["PERCENT"] = 21] = "PERCENT";
  TokenType2[TokenType2["EQUAL"] = 22] = "EQUAL";
  TokenType2[TokenType2["PLUS_EQUAL"] = 23] = "PLUS_EQUAL";
  TokenType2[TokenType2["MINUS_EQUAL"] = 24] = "MINUS_EQUAL";
  TokenType2[TokenType2["STAR_EQUAL"] = 25] = "STAR_EQUAL";
  TokenType2[TokenType2["SLASH_EQUAL"] = 26] = "SLASH_EQUAL";
  TokenType2[TokenType2["STAR_STAR_EQUAL"] = 27] = "STAR_STAR_EQUAL";
  TokenType2[TokenType2["PERCENT_EQUAL"] = 28] = "PERCENT_EQUAL";
  TokenType2[TokenType2["NULL_COALESCE_EQUAL"] = 29] = "NULL_COALESCE_EQUAL";
  TokenType2[TokenType2["LOGICAL_OR_EQUAL"] = 30] = "LOGICAL_OR_EQUAL";
  TokenType2[TokenType2["PLUS_DOT_EQUAL"] = 31] = "PLUS_DOT_EQUAL";
  TokenType2[TokenType2["BANG_EQUAL"] = 32] = "BANG_EQUAL";
  TokenType2[TokenType2["BANG_EQUAL_EQUAL"] = 33] = "BANG_EQUAL_EQUAL";
  TokenType2[TokenType2["EQUAL_EQUAL"] = 34] = "EQUAL_EQUAL";
  TokenType2[TokenType2["EQUAL_EQUAL_EQUAL"] = 35] = "EQUAL_EQUAL_EQUAL";
  TokenType2[TokenType2["GREATER"] = 36] = "GREATER";
  TokenType2[TokenType2["GREATER_EQUAL"] = 37] = "GREATER_EQUAL";
  TokenType2[TokenType2["LESS"] = 38] = "LESS";
  TokenType2[TokenType2["LESS_EQUAL"] = 39] = "LESS_EQUAL";
  TokenType2[TokenType2["SPACESHIP"] = 40] = "SPACESHIP";
  TokenType2[TokenType2["ARROW"] = 41] = "ARROW";
  TokenType2[TokenType2["BANG"] = 42] = "BANG";
  TokenType2[TokenType2["COLON_COLON"] = 43] = "COLON_COLON";
  TokenType2[TokenType2["LOGICAL_AND"] = 44] = "LOGICAL_AND";
  TokenType2[TokenType2["LOGICAL_OR"] = 45] = "LOGICAL_OR";
  TokenType2[TokenType2["NULL_COALESCE"] = 46] = "NULL_COALESCE";
  TokenType2[TokenType2["ELVIS"] = 47] = "ELVIS";
  TokenType2[TokenType2["OPTIONAL_CHAIN"] = 48] = "OPTIONAL_CHAIN";
  TokenType2[TokenType2["IDENTIFIER"] = 49] = "IDENTIFIER";
  TokenType2[TokenType2["NUMBER"] = 50] = "NUMBER";
  TokenType2[TokenType2["DOUBLE_QUOTE"] = 51] = "DOUBLE_QUOTE";
  TokenType2[TokenType2["STRING"] = 52] = "STRING";
  TokenType2[TokenType2["STRING_PART"] = 53] = "STRING_PART";
  TokenType2[TokenType2["ABSTRACT"] = 54] = "ABSTRACT";
  TokenType2[TokenType2["AS"] = 55] = "AS";
  TokenType2[TokenType2["CATCH"] = 56] = "CATCH";
  TokenType2[TokenType2["CLASS"] = 57] = "CLASS";
  TokenType2[TokenType2["CLONE"] = 58] = "CLONE";
  TokenType2[TokenType2["CONST"] = 59] = "CONST";
  TokenType2[TokenType2["DEFAULT"] = 60] = "DEFAULT";
  TokenType2[TokenType2["ECHO"] = 61] = "ECHO";
  TokenType2[TokenType2["ELSE"] = 62] = "ELSE";
  TokenType2[TokenType2["EXTENDS"] = 63] = "EXTENDS";
  TokenType2[TokenType2["FALSE"] = 64] = "FALSE";
  TokenType2[TokenType2["FINAL"] = 65] = "FINAL";
  TokenType2[TokenType2["FINALLY"] = 66] = "FINALLY";
  TokenType2[TokenType2["FOREACH"] = 67] = "FOREACH";
  TokenType2[TokenType2["FOR"] = 68] = "FOR";
  TokenType2[TokenType2["FUN"] = 69] = "FUN";
  TokenType2[TokenType2["IF"] = 70] = "IF";
  TokenType2[TokenType2["INSTANCEOF"] = 71] = "INSTANCEOF";
  TokenType2[TokenType2["IMPLEMENTS"] = 72] = "IMPLEMENTS";
  TokenType2[TokenType2["MATCH"] = 73] = "MATCH";
  TokenType2[TokenType2["NEW"] = 74] = "NEW";
  TokenType2[TokenType2["NULL"] = 75] = "NULL";
  TokenType2[TokenType2["PRIVATE"] = 76] = "PRIVATE";
  TokenType2[TokenType2["PROTECTED"] = 77] = "PROTECTED";
  TokenType2[TokenType2["PUBLIC"] = 78] = "PUBLIC";
  TokenType2[TokenType2["READONLY"] = 79] = "READONLY";
  TokenType2[TokenType2["RETURN"] = 80] = "RETURN";
  TokenType2[TokenType2["STATIC"] = 81] = "STATIC";
  TokenType2[TokenType2["SUPER"] = 82] = "SUPER";
  TokenType2[TokenType2["THIS"] = 83] = "THIS";
  TokenType2[TokenType2["THROW"] = 84] = "THROW";
  TokenType2[TokenType2["TRUE"] = 85] = "TRUE";
  TokenType2[TokenType2["TRY"] = 86] = "TRY";
  TokenType2[TokenType2["VAL"] = 87] = "VAL";
  TokenType2[TokenType2["VAR"] = 88] = "VAR";
  TokenType2[TokenType2["WHILE"] = 89] = "WHILE";
  TokenType2[TokenType2["EOF"] = 90] = "EOF";
})(TokenType ||= {});

// nodes.ts
class Node {
}

class Program extends Node {
  statements;
  environment;
  _type = "Program";
  constructor(statements, environment) {
    super();
    this.statements = statements;
    this.environment = environment;
  }
  accept(visitor) {
    return visitor.visitProgram(this);
  }
}

class If extends Node {
  condition;
  thenBranch;
  elseBranch;
  _type = "If";
  constructor(condition, thenBranch, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept(visitor) {
    return visitor.visitIf(this);
  }
}

class Block extends Node {
  statements;
  _type = "Block";
  constructor(statements) {
    super();
    this.statements = statements;
  }
  accept(visitor) {
    return visitor.visitBlock(this);
  }
}

class VarDeclaration extends Node {
  name;
  type;
  initializer;
  _type = "VarDeclaration";
  constructor(name, type, initializer) {
    super();
    this.name = name;
    this.type = type;
    this.initializer = initializer;
  }
  accept(visitor) {
    return visitor.visitVarDeclaration(this);
  }
}

class VarDestructuringDeclaration extends Node {
  destructuring;
  initializer;
  _type = "VarDestructuringDeclaration";
  constructor(destructuring, initializer) {
    super();
    this.destructuring = destructuring;
    this.initializer = initializer;
  }
  accept(visitor) {
    return visitor.visitVarDestructuringDeclaration(this);
  }
}

class Destructuring extends Node {
  elements;
  _type = "Destructure";
  constructor(elements) {
    super();
    this.elements = elements;
  }
  accept(visitor) {
    return visitor.visitDestructuring(this);
  }
}

class DestructuringElement extends Node {
  key;
  value;
  type;
  _type = "DestructuringElement";
  constructor(key, value, type) {
    super();
    this.key = key;
    this.value = value;
    this.type = type;
  }
  accept(visitor) {
    return visitor.visitDestructuringElement(this);
  }
}

class Echo extends Node {
  expression;
  _type = "Echo";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitEcho(this);
  }
}

class ExpressionStatement extends Node {
  expression;
  _type = "ExpressionStatement";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitExpressionStatement(this);
  }
}

class While extends Node {
  condition;
  body;
  _type = "While";
  constructor(condition, body) {
    super();
    this.condition = condition;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitWhile(this);
  }
}

class For extends Node {
  initializer;
  condition;
  increment;
  body;
  _type = "For";
  constructor(initializer, condition, increment, body) {
    super();
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitFor(this);
  }
}

class Foreach extends Node {
  key;
  value;
  iterable;
  body;
  _type = "Foreach";
  constructor(key, value, iterable, body) {
    super();
    this.key = key;
    this.value = value;
    this.iterable = iterable;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitForeach(this);
  }
}

class ForeachVariable extends Node {
  name;
  type;
  _type = "ForeachVariable";
  constructor(name, type) {
    super();
    this.name = name;
    this.type = type;
  }
  accept(visitor) {
    return visitor.visitForeachVariable(this);
  }
}

class FunctionDeclaration extends Node {
  name;
  params;
  returnType;
  body;
  _type = "FunctionDeclaration";
  constructor(name, params, returnType, body) {
    super();
    this.name = name;
    this.params = params;
    this.returnType = returnType;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitFunctionDeclaration(this);
  }
}
function paramIsExpressibleInPhp() {
  return this.type === null || this.type.isExpressibleInPhp();
}
function simplifyParam() {
  let type = this.type;
  if (type === null || type.isExpressibleInPhp())
    return this;
  return new Param(this.name, type.simplify(), this.initializer);
}

class Param extends Node {
  name;
  type;
  initializer;
  _type = "Param";
  constructor(name, type, initializer) {
    super();
    this.name = name;
    this.type = type;
    this.initializer = initializer;
  }
  accept(visitor) {
    return visitor.visitParam(this);
  }
  isExpressibleInPhp = paramIsExpressibleInPhp;
  simplify = simplifyParam;
}

class Return extends Node {
  value;
  _type = "Return";
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitReturn(this);
  }
}

class Try extends Node {
  tryBlock;
  catches;
  finallyBlock;
  _type = "Try";
  constructor(tryBlock, catches, finallyBlock) {
    super();
    this.tryBlock = tryBlock;
    this.catches = catches;
    this.finallyBlock = finallyBlock;
    if (catches.length === 0 && finallyBlock === null) {
      throw new Error("Try statement must have at least one catch or finally block");
    }
  }
  accept(visitor) {
    return visitor.visitTry(this);
  }
}

class Catch extends Node {
  variable;
  types;
  body;
  _type = "Catch";
  constructor(variable, types, body) {
    super();
    this.variable = variable;
    this.types = types;
    this.body = body;
    if (types.length === 0) {
      throw new Error("Catch variable must have at least one type");
    }
  }
  accept(visitor) {
    return visitor.visitCatch(this);
  }
}

class ThrowStatement extends Node {
  expression;
  _type = "ThrowStatement";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitThrowStatement(this);
  }
}
function classProperties() {
  return this.members.filter((m) => m instanceof ClassProperty);
}

class ClassDeclaration extends Node {
  name;
  constructorVisibility;
  params;
  superclass;
  interfaces;
  iterates;
  members;
  isAbstract;
  environment;
  _type = "ClassDeclaration";
  constructor(name, constructorVisibility, params, superclass, interfaces, iterates, members, isAbstract = false, environment) {
    super();
    this.name = name;
    this.constructorVisibility = constructorVisibility;
    this.params = params;
    this.superclass = superclass;
    this.interfaces = interfaces;
    this.iterates = iterates;
    this.members = members;
    this.isAbstract = isAbstract;
    this.environment = environment;
  }
  accept(visitor) {
    return visitor.visitClassDeclaration(this);
  }
  properties = classProperties;
}

class ClassSuperclass extends Node {
  name;
  args;
  _type = "ClassSuperclass";
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }
  accept(visitor) {
    return visitor.visitClassSuperclass(this);
  }
}

class ClassProperty extends Node {
  isFinal;
  visibility;
  isStatic;
  isReadonly;
  name;
  type;
  initializer;
  _type = "ClassProperty";
  constructor(isFinal, visibility, isStatic, isReadonly, name, type, initializer) {
    super();
    this.isFinal = isFinal;
    this.visibility = visibility;
    this.isStatic = isStatic;
    this.isReadonly = isReadonly;
    this.name = name;
    this.type = type;
    this.initializer = initializer;
  }
  accept(visitor) {
    return visitor.visitClassProperty(this);
  }
}

class ClassMethod extends Node {
  isFinal;
  visibility;
  isStatic;
  name;
  params;
  returnType;
  body;
  _type = "ClassMethod";
  constructor(isFinal, visibility, isStatic, name, params, returnType, body) {
    super();
    this.isFinal = isFinal;
    this.visibility = visibility;
    this.isStatic = isStatic;
    this.name = name;
    this.params = params;
    this.returnType = returnType;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitClassMethod(this);
  }
}

class ClassAbstractMethod extends Node {
  visibility;
  isStatic;
  name;
  params;
  returnType;
  _type = "ClassAbstractMethod";
  constructor(visibility, isStatic, name, params, returnType) {
    super();
    this.visibility = visibility;
    this.isStatic = isStatic;
    this.name = name;
    this.params = params;
    this.returnType = returnType;
  }
  accept(visitor) {
    return visitor.visitClassAbstractMethod(this);
  }
}

class ClassConst extends Node {
  isFinal;
  visibility;
  isStatic;
  name;
  type;
  initializer;
  _type = "ClassConst";
  constructor(isFinal, visibility, isStatic, name, type, initializer) {
    super();
    this.isFinal = isFinal;
    this.visibility = visibility;
    this.isStatic = isStatic;
    this.name = name;
    this.type = type;
    this.initializer = initializer;
  }
  accept(visitor) {
    return visitor.visitClassConst(this);
  }
}

class ClassInitializer extends Node {
  body;
  _type = "ClassInitializer";
  constructor(body) {
    super();
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitClassInitializer(this);
  }
}

class Assign extends Node {
  name;
  operator;
  value;
  _type = "Assign";
  constructor(name, operator, value) {
    super();
    this.name = name;
    this.operator = operator;
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitAssign(this);
  }
}

class Call extends Node {
  callee;
  args;
  _type = "Call";
  constructor(callee, args) {
    super();
    this.callee = callee;
    this.args = args;
  }
  accept(visitor) {
    return visitor.visitCall(this);
  }
}

class Get extends Node {
  object;
  name;
  _type = "Get";
  constructor(object, name) {
    super();
    this.object = object;
    this.name = name;
  }
  accept(visitor) {
    return visitor.visitGetExpr(this);
  }
}

class OptionalGet extends Node {
  object;
  name;
  _type = "OptionalGet";
  constructor(object, name) {
    super();
    this.object = object;
    this.name = name;
  }
  accept(visitor) {
    return visitor.visitOptionalGet(this);
  }
}

class Pipeline extends Node {
  left;
  right;
  _type = "Pipeline";
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitPipeline(this);
  }
}

class Binary extends Node {
  left;
  operator;
  right;
  _type = "Binary";
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitBinary(this);
  }
}

class Ternary extends Node {
  condition;
  left;
  right;
  _type = "Ternary";
  constructor(condition, left, right) {
    super();
    this.condition = condition;
    this.left = left;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitTernary(this);
  }
}

class Grouping extends Node {
  expression;
  _type = "Grouping";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitGrouping(this);
  }
}

class NumberLiteral extends Node {
  value;
  _type = "NumberLiteral";
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitNumberLiteral(this);
  }
}

class StringLiteral extends Node {
  value;
  _type = "StringLiteral";
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitStringLiteral(this);
  }
}

class TemplateStringLiteral extends Node {
  parts;
  _type = "TemplateStringLiteral";
  constructor(parts) {
    super();
    this.parts = parts;
  }
  accept(visitor) {
    return visitor.visitTemplateStringLiteral(this);
  }
}
class BooleanLiteral extends Node {
  value;
  _type = "BooleanLiteral";
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitBooleanLiteral(this);
  }
}

class NullLiteral extends Node {
  _type = "NullLiteral";
  accept(visitor) {
    return visitor.visitNullLiteral(this);
  }
}

class ArrayLiteral extends Node {
  elements;
  _type = "ArrayLiteral";
  constructor(elements) {
    super();
    this.elements = elements;
  }
  accept(visitor) {
    return visitor.visitArrayLiteral(this);
  }
}

class ArrayElement extends Node {
  key;
  value;
  _type = "ArrayElement";
  constructor(key, value) {
    super();
    this.key = key;
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitArrayElement(this);
  }
}

class ArrayAccess extends Node {
  left;
  index;
  _type = "ArrayAccess";
  constructor(left, index) {
    super();
    this.left = left;
    this.index = index;
  }
  accept(visitor) {
    return visitor.visitArrayAccess(this);
  }
}

class Unary extends Node {
  operator;
  right;
  _type = "Unary";
  constructor(operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitUnary(this);
  }
}
class Postfix extends Node {
  left;
  operator;
  _type = "Postfix";
  constructor(left, operator) {
    super();
    this.left = left;
    this.operator = operator;
  }
  accept(visitor) {
    return visitor.visitPostfix(this);
  }
}

class Identifier extends Node {
  name;
  _type = "Identifier";
  kind = null;
  constructor(name) {
    super();
    this.name = name;
  }
  accept(visitor) {
    return visitor.visitIdentifier(this);
  }
  bind(kind) {
    this.kind = kind;
  }
}

class FunctionExpression extends Node {
  params;
  returnType;
  body;
  _type = "FunctionExpression";
  closureVariables = [];
  constructor(params, returnType, body) {
    super();
    this.params = params;
    this.returnType = returnType;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitFunctionExpression(this);
  }
  addClosureVariable(id) {
    this.closureVariables.push(id);
  }
}

class New extends Node {
  expression;
  _type = "New";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitNew(this);
  }
}

class Clone extends Node {
  expression;
  _type = "Clone";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitClone(this);
  }
}

class Match extends Node {
  subject;
  arms;
  defaultArm;
  _type = "Match";
  constructor(subject, arms, defaultArm) {
    super();
    this.subject = subject;
    this.arms = arms;
    this.defaultArm = defaultArm;
  }
  accept(visitor) {
    return visitor.visitMatch(this);
  }
}

class MatchArm extends Node {
  patterns;
  body;
  _type = "MatchArm";
  constructor(patterns, body) {
    super();
    this.patterns = patterns;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitMatchArm(this);
  }
}

class ThrowExpression extends Node {
  expression;
  _type = "ThrowExpression";
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitThrowExpression(this);
  }
}

class This extends Node {
  _type = "This";
  accept(visitor) {
    return visitor.visitThis();
  }
}

class Super extends Node {
  _type = "Super";
  accept(visitor) {
    return visitor.visitSuper();
  }
}

class ScopeResolution extends Node {
  left;
  right;
  _type = "ScopeResolution";
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitScopeResolution(this);
  }
}

// types.ts
var returnTrue = () => true;
function returnThis() {
  return this;
}

class Type {
  isExpressibleInPhp = returnTrue;
  simplify = returnThis;
}

class Number extends Type {
  accept(visitor) {
    return visitor.visitNumberType(this);
  }
}

class String extends Type {
  accept(visitor) {
    return visitor.visitStringType(this);
  }
}

class Boolean extends Type {
  accept(visitor) {
    return visitor.visitBooleanType(this);
  }
}

class Int extends Type {
  accept(visitor) {
    return visitor.visitIntType(this);
  }
}

class Float extends Type {
  accept(visitor) {
    return visitor.visitFloatType(this);
  }
}

class Null extends Type {
  accept(visitor) {
    return visitor.visitNullType(this);
  }
}
function hasNoGenerics() {
  return this.generics.length === 0;
}
function simplifyIdentifier() {
  return this.generics.length === 0 ? this : new Identifier2(this.name, []);
}

class Identifier2 extends Type {
  name;
  generics;
  constructor(name, generics) {
    super();
    this.name = name;
    this.generics = generics;
  }
  accept(visitor) {
    return visitor.visitIdentifierType(this);
  }
  isExpressibleInPhp = hasNoGenerics;
  simplify = simplifyIdentifier;
}

class NumberLiteral2 extends Type {
  value;
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitNumberLiteralType(this);
  }
}

class StringLiteral2 extends Type {
  value;
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitStringLiteralType(this);
  }
}

class True extends Type {
  accept(visitor) {
    return visitor.visitTrueType(this);
  }
}

class False extends Type {
  accept(visitor) {
    return visitor.visitFalseType(this);
  }
}

class Nullable extends Type {
  type;
  constructor(type) {
    super();
    this.type = type;
  }
  accept(visitor) {
    return visitor.visitNullableType(this);
  }
}

class Union extends Type {
  types;
  constructor(types) {
    super();
    this.types = types;
  }
  accept(visitor) {
    return visitor.visitUnionType(this);
  }
}

class Intersection extends Type {
  types;
  constructor(types) {
    super();
    this.types = types;
  }
  accept(visitor) {
    return visitor.visitIntersectionType(this);
  }
}

// parser/environment.ts
class HoistedEnvironment {
  values = new Map;
  constructor(initial) {
    if (initial) {
      for (let key of Object.keys(initial)) {
        this.add(key, initial[key]);
      }
    }
  }
  has(name) {
    return this.get(name) !== null;
  }
  get(name) {
    return this.values.get(name) ?? null;
  }
  add(value, kind) {
    this.values.set(value, kind);
  }
}

class ClassEnvironment {
  values = new Map;
  constructor(initial) {
    if (initial) {
      for (let key of Object.keys(initial)) {
        this.add(key, initial[key]);
      }
    }
  }
  has(name) {
    return this.get(name) !== null;
  }
  get(name) {
    return this.values.get(name) ?? null;
  }
  add(value, kind) {
    this.values.set(value, kind);
  }
}

class LocalEnvironment {
  values = new Set;
  has(name) {
    return this.get(name) !== null;
  }
  get(name) {
    return this.values.has(name) ? 1 /* Variable */ : null;
  }
  add(value) {
    this.values.add(value);
  }
}

class ClosureEnvironment {
  enclosed;
  values = new Set;
  constructor(enclosed) {
    this.enclosed = enclosed;
  }
  has(name) {
    return this.get(name) !== null;
  }
  get(name) {
    if (this.values.has(name))
      return 1 /* Variable */;
    if (this.enclosed.has(name))
      return 2 /* ClosureVariable */;
    return null;
  }
  add(value) {
    this.values.add(value);
  }
}

// parser/parser.ts
var emptyArray = [];
var {
  ABSTRACT,
  AMPERSAND,
  ARROW,
  AS,
  BANG_EQUAL_EQUAL,
  BANG_EQUAL,
  BANG,
  CATCH,
  CLASS,
  CLONE,
  COLON_COLON,
  COLON,
  COMMA,
  CONST,
  DEFAULT,
  DOT,
  DOUBLE_QUOTE,
  ECHO,
  ELSE,
  EOF,
  EQUAL_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL,
  EXTENDS,
  FALSE,
  FINAL,
  FINALLY,
  FOREACH,
  FOR,
  FUN,
  GREATER_EQUAL,
  GREATER,
  IDENTIFIER,
  IF,
  IMPLEMENTS,
  INSTANCEOF,
  LEFT_BRACE,
  LEFT_BRACKET,
  LEFT_PAREN,
  LESS_EQUAL,
  LESS,
  LOGICAL_AND,
  LOGICAL_OR_EQUAL,
  LOGICAL_OR,
  MATCH,
  MINUS_EQUAL,
  MINUS_MINUS,
  MINUS,
  NEW,
  NULL_COALESCE_EQUAL,
  NULL_COALESCE,
  NULL,
  NUMBER,
  OPTIONAL_CHAIN,
  PERCENT_EQUAL,
  PERCENT,
  PIPE,
  PLUS_DOT_EQUAL,
  PLUS_DOT,
  PLUS_EQUAL,
  PLUS_PLUS,
  PLUS,
  PRIVATE,
  PROTECTED,
  PUBLIC,
  QUESTION,
  READONLY,
  RETURN,
  RIGHT_BRACE,
  RIGHT_BRACKET,
  RIGHT_PAREN,
  SEMICOLON,
  SLASH_EQUAL,
  SLASH,
  SPACESHIP,
  STAR_STAR_EQUAL,
  STAR_STAR,
  STAR_EQUAL,
  STAR,
  STATIC,
  STRING_PART,
  STRING,
  SUPER,
  THIS,
  THROW,
  TRUE,
  TRY,
  VAL,
  VAR,
  WHILE
} = TokenType;

class ParseError extends Error {
}
function parse(tokens, {
  enclosingEnvironment = null,
  buildEnvironment = false
} = {}) {
  let tokensIndex = 0;
  let hoistedEnvironment = new HoistedEnvironment;
  return program();
  function program() {
    const statements = [];
    semicolons();
    while (!isAtEnd()) {
      statements.push(declaration());
      semicolons();
    }
    return new Program(statements, buildEnvironment ? hoistedEnvironment : new HoistedEnvironment);
  }
  function declaration() {
    if (match(TRY))
      return tryDeclaration();
    if (match(THROW))
      return throwDeclaration();
    if (match(FUN))
      return functionDeclaration();
    if (match(VAR)) {
      if (match(LEFT_BRACKET))
        return varDestructuringDeclaration();
      return varDeclaration();
    }
    if (match(CLASS))
      return classDeclaration();
    if (match(ABSTRACT)) {
      consume('Expect "class" after "abstract"', CLASS);
      return classDeclaration(true);
    }
    return statement();
  }
  function tryDeclaration() {
    consume('Expect "{" before try body', LEFT_BRACE);
    return new Try(block(), tryCatches(), tryFinally());
  }
  function tryCatches() {
    let catches = [];
    while (match(CATCH)) {
      consume('Expect "(" after catch', LEFT_PAREN);
      let name = consume("Expect variable name", IDENTIFIER).lexeme;
      consume('Expect ":" after catch variable', COLON);
      let types = tryCatchTypes();
      consume('Expect ")" after catch', RIGHT_PAREN);
      consume('Expect "{" before catch body', LEFT_BRACE);
      let body = block();
      catches.push(new Catch(name, types, body));
    }
    return catches;
  }
  function tryCatchTypes() {
    let types = [consume("Expect exception type", IDENTIFIER).lexeme];
    while (match(PIPE)) {
      types.push(consume("Expect exception type", IDENTIFIER).lexeme);
    }
    return types;
  }
  function tryFinally() {
    if (!match(FINALLY))
      return null;
    consume('Expect "{" before finally body', LEFT_BRACE);
    return block();
  }
  function throwDeclaration() {
    return new ThrowStatement(expression());
  }
  function classDeclaration(isAbstract = false) {
    let env = new ClassEnvironment;
    let name = consume("Expect class name", IDENTIFIER).lexeme;
    hoistedEnvironment.add(name, 4 /* Class */);
    let constructorVisibility = classVisibility();
    let params = match(LEFT_PAREN) ? classParams(env) : emptyArray;
    let superclass = match(EXTENDS) ? classSuperclass() : null;
    let interfaces = match(IMPLEMENTS) ? classInterfaces() : emptyArray;
    let iterates = classIterates();
    consume('Expect "{" before class body', LEFT_BRACE);
    let members = classMembers(env);
    consume('Expect "}" after class body', RIGHT_BRACE);
    return new ClassDeclaration(name, constructorVisibility, params, superclass, interfaces, iterates, members, isAbstract, buildEnvironment ? env : new ClassEnvironment);
  }
  function classParams(env) {
    if (match(RIGHT_PAREN))
      return emptyArray;
    let params = [classParam(env)];
    while (match(COMMA)) {
      if (check(RIGHT_PAREN))
        break;
      params.push(classParam(env));
    }
    consume('Expect ")" after class params', RIGHT_PAREN);
    return params;
  }
  function classParam(env) {
    if (check(IDENTIFIER))
      return functionParam();
    let isFinal = match(FINAL);
    let visibility = classVisibility();
    consume("Expect var or val before class promoted property", VAR, VAL);
    let isReadonly = previous().type === VAL;
    let name = consume("Expect class param name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    let initializer = match(EQUAL) ? expression() : null;
    env.add(name, 5 /* ClassProperty */);
    return new ClassProperty(isFinal, visibility, false, isReadonly, name, type2, initializer);
  }
  function classSuperclass() {
    let name = consume("Expect superclass name", IDENTIFIER).lexeme;
    let args = match(LEFT_PAREN) ? classSuperclassArgs() : emptyArray;
    return new ClassSuperclass(name, args);
  }
  function classSuperclassArgs() {
    if (match(RIGHT_PAREN))
      return emptyArray;
    let args = [expression()];
    while (match(COMMA)) {
      if (check(RIGHT_PAREN))
        break;
      args.push(expression());
    }
    consume('Expect ")" after superclass arguments', RIGHT_PAREN);
    return args;
  }
  function classInterfaces() {
    let interfaces = [consume("Expect interface name", IDENTIFIER).lexeme];
    while (match(COMMA)) {
      if (check(RIGHT_BRACE))
        break;
      interfaces.push(consume("Expect interface name", IDENTIFIER).lexeme);
    }
    return interfaces;
  }
  function classIterates() {
    if (matchIdentifier("iterates")) {
      consume("Expect identifier after iterates", IDENTIFIER);
      return identifier();
    }
    return null;
  }
  function classMembers(env) {
    let members = [];
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
      members.push(classMember(env));
      semicolons();
    }
    return members;
  }
  function classMember(env) {
    if (match(ABSTRACT))
      return abstractClassMember(env);
    let isFinal = match(FINAL);
    let visibility = classVisibility();
    let isStatic = match(STATIC);
    if (match(FUN))
      return classMethod(env, isFinal, visibility, isStatic);
    if (matchIdentifier("init"))
      return classInitializer();
    if (match(CONST))
      return classConst(env, isFinal, visibility, isStatic);
    if (match(VAR, VAL)) {
      let isReadonly = previous().type === VAL;
      return classProperty(env, isFinal, visibility, isStatic, isReadonly);
    }
    throw error(peek(), "Expect class member");
  }
  function abstractClassMember(env) {
    let visibility = classVisibility();
    let isStatic = match(STATIC);
    consume("Expect class method declaration", FUN);
    return abstractClassMethod(env, visibility, isStatic);
  }
  function abstractClassMethod(env, visibility, isStatic) {
    let name = consume("Expect method name", IDENTIFIER).lexeme;
    consume('Expect "(" after method name', LEFT_PAREN);
    let params = functionParams();
    let returnType = match(COLON) ? typeAnnotation() : null;
    env.add(name, 6 /* ClassMethod */);
    return new ClassAbstractMethod(visibility, isStatic, name, params, returnType);
  }
  function classVisibility() {
    if (match(PUBLIC, PLUS))
      return "public";
    if (match(PROTECTED))
      return "protected";
    if (match(PRIVATE, MINUS))
      return "private";
    return null;
  }
  function classMethod(env, isFinal, visibility, isStatic) {
    let name = consume("Expect function name", IDENTIFIER).lexeme;
    consume('Expect "(" after function name', LEFT_PAREN);
    let params = functionParams();
    let returnType = match(COLON) ? typeAnnotation() : null;
    env.add(name, 6 /* ClassMethod */);
    return new ClassMethod(isFinal, visibility, isStatic, name, params, returnType, functionBody());
  }
  function classProperty(env, isFinal, visibility, isStatic, isReadonly) {
    let name = consume("Expect variable name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    let initializer = match(EQUAL) ? expression() : null;
    env.add(name, 5 /* ClassProperty */);
    return new ClassProperty(isFinal, visibility, isStatic, isReadonly, name, type2, initializer);
  }
  function classConst(env, isFinal, visibility, isStatic) {
    let name = consume("Expect class constant name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    consume('Expect "=" after class constant name', EQUAL);
    let initializer = expression();
    env.add(name, 7 /* ClassConst */);
    return new ClassConst(isFinal, visibility, isStatic, name, type2, initializer);
  }
  function classInitializer() {
    consume('Expect "{" before class initializer body', LEFT_BRACE);
    return new ClassInitializer(block());
  }
  function functionDeclaration() {
    let name = consume("Expect function name", IDENTIFIER).lexeme;
    consume('Expect "(" after function name', LEFT_PAREN);
    hoistedEnvironment.add(name, 3 /* Function */);
    let params = functionParams();
    let returnType = match(COLON) ? typeAnnotation() : null;
    return new FunctionDeclaration(name, params, returnType, functionBody());
  }
  function functionExpression() {
    consume('Expect "(" after fun', LEFT_PAREN);
    let params = functionParams();
    let returnType = match(COLON) ? typeAnnotation() : null;
    return new FunctionExpression(params, returnType, functionBody());
  }
  function functionParams() {
    let params = [];
    if (!check(RIGHT_PAREN)) {
      params.push(functionParam());
      while (match(COMMA)) {
        if (check(RIGHT_PAREN))
          break;
        params.push(functionParam());
      }
    }
    consume('Expect ")" after function params', RIGHT_PAREN);
    return params;
  }
  function functionParam() {
    let name = consume("Expect parameter name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    let initializer = match(EQUAL) ? expression() : null;
    return new Param(name, type2, initializer);
  }
  function functionBody() {
    if (match(ARROW)) {
      let result = expression();
      match(SEMICOLON);
      return result;
    }
    if (match(LEFT_BRACE))
      return block();
    throw error(peek(), 'Expect "=>" or "{" before function body');
  }
  function varDeclaration() {
    let name = consume("Expect variable name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    let initializer = match(EQUAL) ? expression() : null;
    return new VarDeclaration(name, type2, initializer);
  }
  function varDestructuringDeclaration() {
    let d = destructuring();
    consume('Expect "=" after var destructuring', EQUAL);
    let initializer = expression();
    return new VarDestructuringDeclaration(d, initializer);
  }
  function destructuring() {
    let result = [];
    while (!check(RIGHT_BRACKET) && !isAtEnd()) {
      if (match(COMMA)) {
        result.push(null);
      } else {
        result.push(destructuringElement());
        match(COMMA);
      }
    }
    consume('Expect "]" after destructuring', RIGHT_BRACKET);
    return new Destructuring(result);
  }
  function destructuringElement() {
    let key = null;
    if (match(STRING)) {
      key = stringLiteral().value;
      consume('Expect "=>" after string key', ARROW);
    }
    let value = consume("Expect value name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    return new DestructuringElement(key, value, type2);
  }
  function statement() {
    if (match(FOREACH))
      return foreachStatement();
    if (match(FOR))
      return forStatement();
    if (match(IF))
      return ifStatement();
    if (match(WHILE))
      return whileStatement();
    if (match(ECHO))
      return echoStatement();
    if (match(RETURN))
      return returnStatement();
    if (match(LEFT_BRACE))
      return block();
    return expressionStatement();
  }
  function foreachStatement() {
    consume('Expect "(" after "foreach"', LEFT_PAREN);
    let iterable = expression();
    consume('Expect "as" after foreach iterable expression', AS);
    let value = match(LEFT_BRACKET) ? destructuring() : foreachVariable();
    let key = null;
    if (value instanceof ForeachVariable && match(ARROW)) {
      key = value;
      value = foreachVariable();
    }
    consume('Expect ")" after foreach expression', RIGHT_PAREN);
    let body = statement();
    return new Foreach(key, value, iterable, body);
  }
  function foreachVariable() {
    let name = consume("Expect variable name", IDENTIFIER).lexeme;
    let type2 = match(COLON) ? typeAnnotation() : null;
    return new ForeachVariable(name, type2);
  }
  function forStatement() {
    consume('Expect "(" after "for"', LEFT_PAREN);
    let initializer = forInitializer();
    let condition = forCondition();
    let increment = forIncrement();
    consume('Expect ")" after for clauses', RIGHT_PAREN);
    let body = statement();
    return new For(initializer, condition, increment, body);
  }
  function forInitializer() {
    if (match(SEMICOLON))
      return null;
    let result = match(VAR) ? varDeclaration() : expression();
    consume('Expect ";" after loop initializer', SEMICOLON);
    return result;
  }
  function forCondition() {
    if (match(SEMICOLON))
      return null;
    let result = expression();
    consume('Expect ";" after loop condition', SEMICOLON);
    return result;
  }
  function forIncrement() {
    if (check(RIGHT_PAREN))
      return null;
    return expression();
  }
  function ifStatement() {
    consume('Expect "(" after "if"', LEFT_PAREN);
    let condition = expression();
    consume('Expect ")" after if condition', RIGHT_PAREN);
    let thenBranch = statement();
    let elseBranch = match(ELSE) ? statement() : null;
    return new If(condition, thenBranch, elseBranch);
  }
  function echoStatement() {
    return new Echo(expression());
  }
  function returnStatement() {
    return new Return(expression());
  }
  function whileStatement() {
    consume('Expect "(" after "while"', LEFT_PAREN);
    let condition = expression();
    consume('Expect ")" after while condition', RIGHT_PAREN);
    let body = statement();
    return new While(condition, body);
  }
  function block() {
    const statements = [];
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
      const next = declaration();
      if (next)
        statements.push(next);
      semicolons();
    }
    consume('Expect "}" after block', RIGHT_BRACE);
    return new Block(statements);
  }
  function expressionStatement() {
    let result = expression();
    return new ExpressionStatement(result);
  }
  function expression() {
    if (match(FUN))
      return functionExpression();
    if (match(THROW))
      return throwExpression();
    return assignment();
  }
  function throwExpression() {
    return new ThrowExpression(expression());
  }
  function assignment() {
    let result = ternary();
    if (match(EQUAL, PLUS_EQUAL, MINUS_EQUAL, STAR_EQUAL, STAR_STAR_EQUAL, SLASH_EQUAL, PERCENT_EQUAL, NULL_COALESCE_EQUAL, LOGICAL_OR_EQUAL, PLUS_DOT_EQUAL)) {
      let operator = previous();
      let value = assignment();
      if (result instanceof Identifier || result instanceof Get || result instanceof ArrayAccess) {
        return new Assign(result, operator.lexeme, value);
      }
      throw error(operator, "Invalid assignment target");
    }
    return result;
  }
  function ternary() {
    let result = nullCoalesce();
    while (match(QUESTION)) {
      let left = nullCoalesce();
      consume('Expect ":" after ternary condition', COLON);
      let right = nullCoalesce();
      result = new Ternary(result, left, right);
    }
    return result;
  }
  function nullCoalesce() {
    let result = logicalOr();
    while (match(NULL_COALESCE)) {
      let right = nullCoalesce();
      result = new Binary(result, "??", right);
    }
    return result;
  }
  function logicalOr() {
    let result = logicalAnd();
    while (match(LOGICAL_OR)) {
      let operator = previous();
      let right = logicalAnd();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function logicalAnd() {
    let result = equality();
    while (match(LOGICAL_AND)) {
      let operator = previous();
      let right = equality();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function equality() {
    let result = comparison();
    while (match(BANG_EQUAL, EQUAL_EQUAL, BANG_EQUAL_EQUAL, EQUAL_EQUAL_EQUAL, SPACESHIP)) {
      let operator = previous();
      let right = comparison();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function comparison() {
    let result = stringConcat();
    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      let operator = previous();
      let right = stringConcat();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function stringConcat() {
    let result = term();
    while (match(PLUS_DOT)) {
      let operator = previous();
      let right = term();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function term() {
    let result = factor();
    while (match(MINUS, PLUS)) {
      let operator = previous();
      let right = factor();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function factor() {
    let result = instanceOf();
    while (match(SLASH, STAR, PERCENT)) {
      let operator = previous();
      let right = instanceOf();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function instanceOf() {
    let result = exponentiation();
    while (match(INSTANCEOF)) {
      let operator = previous();
      let right = exponentiation();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function exponentiation() {
    let result = unary();
    while (match(STAR_STAR)) {
      let operator = previous();
      let right = exponentiation();
      result = new Binary(result, operator.lexeme, right);
    }
    return result;
  }
  function unary() {
    if (match(BANG, MINUS, PLUS, MINUS_MINUS, PLUS_PLUS)) {
      let operator = previous();
      let right = unary();
      return new Unary(operator.lexeme, right);
    }
    return matchExpression();
  }
  function matchExpression() {
    if (!match(MATCH))
      return postfix();
    consume('Expect "(" after "match"', LEFT_PAREN);
    let subject = expression();
    consume('Expect ")" after match subject', RIGHT_PAREN);
    consume('Expect "{" before match body', LEFT_BRACE);
    let arms = matchArms();
    let defaultArm = matchDefaultArm();
    consume('Expect "}" after match body', RIGHT_BRACE);
    return new Match(subject, arms, defaultArm);
  }
  function matchArms() {
    let arms = [];
    while (!check(RIGHT_BRACE) && !check(DEFAULT) && !isAtEnd()) {
      arms.push(matchArm());
    }
    return arms;
  }
  function matchArm() {
    let patterns = [expression()];
    while (match(COMMA)) {
      if (check(ARROW))
        break;
      patterns.push(expression());
    }
    consume('Expect "=>" after match patterns', ARROW);
    let body = expression();
    match(COMMA);
    return new MatchArm(patterns, body);
  }
  function matchDefaultArm() {
    if (!match(DEFAULT))
      return null;
    consume('Expect "=>" after "default"', ARROW);
    let result = expression();
    match(COMMA);
    return result;
  }
  function postfix() {
    let result = newClone();
    if (match(PLUS_PLUS, MINUS_MINUS)) {
      let operator = previous();
      if (!(result instanceof Identifier))
        throw error(previous(), "Invalid postfix target");
      result = new Postfix(result, operator.lexeme);
    }
    return result;
  }
  function newClone() {
    if (match(NEW))
      return new New(pipeline());
    if (match(CLONE))
      return new Clone(pipeline());
    return pipeline();
  }
  function pipeline() {
    let result = call();
    while (match(PIPE)) {
      let right = call();
      result = new Pipeline(result, right);
    }
    return result;
  }
  function call() {
    let ex = primary();
    while (true) {
      if (match(LEFT_PAREN)) {
        ex = new Call(ex, callArgs());
      } else if (match(DOT)) {
        ex = getExpression(ex);
      } else if (match(OPTIONAL_CHAIN)) {
        ex = optionalGetExpression(ex);
      } else if (match(COLON_COLON)) {
        ex = scopeResolution(ex);
      } else if (match(LEFT_BRACKET)) {
        ex = arrayAccess(ex);
      } else
        break;
    }
    return ex;
  }
  function callArgs() {
    let args = [];
    if (match(RIGHT_PAREN))
      return args;
    args.push(expression());
    while (match(COMMA)) {
      if (check(RIGHT_PAREN))
        break;
      args.push(expression());
    }
    consume('Expect ")" after arguments', RIGHT_PAREN);
    return args;
  }
  function getExpression(receiver) {
    let name = consume("Expect property name after .", IDENTIFIER).lexeme;
    return new Get(receiver, name);
  }
  function optionalGetExpression(receiver) {
    let name = consume("Expect property name after ?.", IDENTIFIER).lexeme;
    return new OptionalGet(receiver, name);
  }
  function scopeResolution(receiver) {
    let name = consume("Expect property name after ::", IDENTIFIER).lexeme;
    return new ScopeResolution(receiver, name);
  }
  function arrayAccess(left) {
    let index = expression();
    consume('Expect "]" after array index', RIGHT_BRACKET);
    return new ArrayAccess(left, index);
  }
  function primary() {
    if (match(NULL))
      return new NullLiteral;
    if (match(NUMBER))
      return numberLiteral();
    if (match(STRING))
      return stringLiteral();
    if (match(DOUBLE_QUOTE))
      return doubleQuoteString();
    if (match(TRUE))
      return new BooleanLiteral(true);
    if (match(FALSE))
      return new BooleanLiteral(false);
    if (match(LEFT_PAREN))
      return grouping();
    if (match(LEFT_BRACKET))
      return arrayLiteral();
    if (match(THIS))
      return new This;
    if (match(SUPER))
      return new Super;
    if (match(IDENTIFIER))
      return identifier();
    throw error(peek(), "Expect expression");
  }
  function numberLiteral() {
    return new NumberLiteral(previous().literal);
  }
  function stringLiteral() {
    return new StringLiteral(previous().literal);
  }
  function doubleQuoteString() {
    return doubleQuoteStringLiteral() ?? doubleQuoteStringTemplate();
  }
  function doubleQuoteStringLiteral() {
    if (match(DOUBLE_QUOTE))
      return new StringLiteral("");
    if (check(STRING_PART) && checkNext(DOUBLE_QUOTE)) {
      match(STRING_PART);
      let result = stringLiteral();
      consume('Expect " to end string', DOUBLE_QUOTE);
      return result;
    }
    return null;
  }
  function doubleQuoteStringTemplate() {
    let parts = [];
    while (!isAtEnd()) {
      if (match(STRING_PART)) {
        parts.push(stringLiteral());
      } else if (match(IDENTIFIER)) {
        parts.push(identifier());
      } else if (match(LEFT_BRACE)) {
        parts.push(expression());
        consume('Expect "}" after expression in string', RIGHT_BRACE);
      }
      if (check(DOUBLE_QUOTE))
        break;
    }
    consume('Expect " to end string', DOUBLE_QUOTE);
    return new TemplateStringLiteral(parts);
  }
  function grouping() {
    let result = expression();
    consume('Expect ")" after expression', RIGHT_PAREN);
    return new Grouping(result);
  }
  function arrayLiteral() {
    let elements = arrayElements();
    consume('Expect "]" after array literal', RIGHT_BRACKET);
    return new ArrayLiteral(elements);
  }
  function arrayElements() {
    let elements = [];
    while (!check(RIGHT_BRACKET) && !isAtEnd()) {
      elements.push(arrayElement());
      match(COMMA);
    }
    return elements;
  }
  function arrayElement() {
    return new ArrayElement(arrayKey(), expression());
  }
  function identifier() {
    return new Identifier(previous().lexeme);
  }
  function arrayKey() {
    if (check(NUMBER, STRING, DOUBLE_QUOTE) && checkNext(ARROW)) {
      let result = match(NUMBER) ? numberLiteral() : match(STRING) ? stringLiteral() : match(DOUBLE_QUOTE) ? arrayKeyDoubleQuoteString() : null;
      match(ARROW);
      return result;
    }
    return null;
  }
  function arrayKeyDoubleQuoteString() {
    let message = "Only simple strings allowed as array keys";
    let string = consume(message, STRING_PART);
    consume(message, DOUBLE_QUOTE);
    return new StringLiteral(string.literal);
  }
  function typeAnnotation() {
    if (match(QUESTION))
      return typeNullable();
    let first = type();
    if (check(PIPE))
      return typeUnion(first);
    if (check(AMPERSAND))
      return typeIntersection(first);
    return first;
  }
  function typeUnion(first) {
    let elements = [first];
    while (match(PIPE)) {
      elements.push(type());
    }
    return new Union(elements);
  }
  function typeIntersection(first) {
    let elements = [first];
    while (match(AMPERSAND)) {
      elements.push(type());
    }
    if (elements.length === 1)
      return elements[0];
    return new Intersection(elements);
  }
  function typeNullable() {
    return new Nullable(type());
  }
  function type() {
    if (match(NULL))
      return new Null;
    if (match(NUMBER))
      return new NumberLiteral2(previous().literal);
    if (match(STRING))
      return new StringLiteral2(previous().literal);
    if (match(TRUE))
      return new True;
    if (match(FALSE))
      return new False;
    if (match(IDENTIFIER))
      return typeIdentifier();
    throw error(peek(), "Expect type annotation");
  }
  function typeIdentifier() {
    let lexeme = previous().lexeme;
    if (lexeme === "number")
      return new Number;
    if (lexeme === "string")
      return new String;
    if (lexeme === "bool")
      return new Boolean;
    if (lexeme === "int")
      return new Int;
    if (lexeme === "float")
      return new Float;
    return new Identifier2(lexeme, typeGenerics());
  }
  function typeGenerics() {
    let generics = [];
    if (match(LESS)) {
      generics.push(typeGeneric());
      while (match(COMMA)) {
        if (check(GREATER))
          break;
        generics.push(typeGeneric());
      }
      consume('Expect ">" after type generics', GREATER);
    }
    return generics;
  }
  function typeGeneric() {
    return typeAnnotation();
  }
  function match(...types) {
    for (let type2 of types) {
      if (check(type2)) {
        advance();
        return true;
      }
    }
    return false;
  }
  function matchIdentifier(name) {
    if (peek().type === IDENTIFIER && peek().lexeme === name) {
      advance();
      return true;
    }
    return false;
  }
  function consume(message, ...anyOf) {
    for (let type2 of anyOf) {
      if (check(type2)) {
        return advance();
      }
    }
    throw error(peek(), message);
  }
  function semicolons() {
    while (match(SEMICOLON)) {
    }
  }
  function error(token, message) {
    return new ParseError(`[line ${token.line}] Error ${TokenType[token.type]}: ${message}`);
  }
  function check(...anyOf) {
    if (isAtEnd())
      return anyOf.includes(EOF);
    return anyOf.includes(peek().type);
  }
  function checkNext(...anyOf) {
    if (isAtEnd())
      return anyOf.includes(EOF);
    return anyOf.includes(peekNext().type);
  }
  function advance() {
    let result = peek();
    if (!isAtEnd())
      tokensIndex++;
    return result;
  }
  function isAtEnd() {
    return peek().type === EOF;
  }
  function peek() {
    return tokens[tokensIndex];
  }
  function peekNext() {
    if (isAtEnd())
      return peek();
    return tokens[tokensIndex + 1];
  }
  function previous() {
    return tokens[tokensIndex - 1];
  }
}
// scanner/scanner.ts
var {
  ABSTRACT: ABSTRACT2,
  AMPERSAND: AMPERSAND2,
  ARROW: ARROW2,
  AS: AS2,
  BANG_EQUAL_EQUAL: BANG_EQUAL_EQUAL2,
  BANG_EQUAL: BANG_EQUAL2,
  BANG: BANG2,
  CATCH: CATCH2,
  CLASS: CLASS2,
  CLONE: CLONE2,
  COLON_COLON: COLON_COLON2,
  COLON: COLON2,
  COMMA: COMMA2,
  CONST: CONST2,
  DEFAULT: DEFAULT2,
  DOT: DOT2,
  DOUBLE_QUOTE: DOUBLE_QUOTE2,
  ECHO: ECHO2,
  ELSE: ELSE2,
  ELVIS,
  EOF: EOF2,
  EQUAL_EQUAL_EQUAL: EQUAL_EQUAL_EQUAL2,
  EQUAL_EQUAL: EQUAL_EQUAL2,
  EQUAL: EQUAL2,
  EXTENDS: EXTENDS2,
  FALSE: FALSE2,
  FINAL: FINAL2,
  FINALLY: FINALLY2,
  FOREACH: FOREACH2,
  FOR: FOR2,
  FUN: FUN2,
  GREATER_EQUAL: GREATER_EQUAL2,
  GREATER: GREATER2,
  IDENTIFIER: IDENTIFIER2,
  IF: IF2,
  IMPLEMENTS: IMPLEMENTS2,
  INSTANCEOF: INSTANCEOF2,
  LEFT_BRACE: LEFT_BRACE2,
  LEFT_BRACKET: LEFT_BRACKET2,
  LEFT_PAREN: LEFT_PAREN2,
  LESS_EQUAL: LESS_EQUAL2,
  LESS: LESS2,
  LOGICAL_AND: LOGICAL_AND2,
  LOGICAL_OR_EQUAL: LOGICAL_OR_EQUAL2,
  LOGICAL_OR: LOGICAL_OR2,
  MATCH: MATCH2,
  MINUS_EQUAL: MINUS_EQUAL2,
  MINUS_MINUS: MINUS_MINUS2,
  MINUS: MINUS2,
  NEW: NEW2,
  NULL_COALESCE_EQUAL: NULL_COALESCE_EQUAL2,
  NULL_COALESCE: NULL_COALESCE2,
  NULL: NULL2,
  NUMBER: NUMBER2,
  OPTIONAL_CHAIN: OPTIONAL_CHAIN2,
  PERCENT_EQUAL: PERCENT_EQUAL2,
  PERCENT: PERCENT2,
  PIPE: PIPE2,
  PLUS_DOT_EQUAL: PLUS_DOT_EQUAL2,
  PLUS_DOT: PLUS_DOT2,
  PLUS_EQUAL: PLUS_EQUAL2,
  PLUS_PLUS: PLUS_PLUS2,
  PLUS: PLUS2,
  PRIVATE: PRIVATE2,
  PROTECTED: PROTECTED2,
  PUBLIC: PUBLIC2,
  QUESTION: QUESTION2,
  READONLY: READONLY2,
  RETURN: RETURN2,
  RIGHT_BRACE: RIGHT_BRACE2,
  RIGHT_BRACKET: RIGHT_BRACKET2,
  RIGHT_PAREN: RIGHT_PAREN2,
  SEMICOLON: SEMICOLON2,
  SLASH_EQUAL: SLASH_EQUAL2,
  SLASH: SLASH2,
  SPACESHIP: SPACESHIP2,
  STAR_EQUAL: STAR_EQUAL2,
  STAR_STAR_EQUAL: STAR_STAR_EQUAL2,
  STAR_STAR: STAR_STAR2,
  STAR: STAR2,
  STATIC: STATIC2,
  STRING_PART: STRING_PART2,
  STRING: STRING2,
  SUPER: SUPER2,
  THIS: THIS2,
  THROW: THROW2,
  TRUE: TRUE2,
  TRY: TRY2,
  VAL: VAL2,
  VAR: VAR2,
  WHILE: WHILE2
} = TokenType;
var keywords = {
  abstract: ABSTRACT2,
  as: AS2,
  catch: CATCH2,
  class: CLASS2,
  clone: CLONE2,
  const: CONST2,
  default: DEFAULT2,
  echo: ECHO2,
  else: ELSE2,
  extends: EXTENDS2,
  false: FALSE2,
  final: FINAL2,
  finally: FINALLY2,
  for: FOR2,
  foreach: FOREACH2,
  fun: FUN2,
  if: IF2,
  instanceof: INSTANCEOF2,
  implements: IMPLEMENTS2,
  match: MATCH2,
  new: NEW2,
  null: NULL2,
  private: PRIVATE2,
  protected: PROTECTED2,
  public: PUBLIC2,
  readonly: READONLY2,
  return: RETURN2,
  static: STATIC2,
  super: SUPER2,
  this: THIS2,
  throw: THROW2,
  true: TRUE2,
  try: TRY2,
  val: VAL2,
  var: VAR2,
  while: WHILE2
};
function scan(source) {
  const tokens = [];
  let start = 0;
  let current = 0;
  let line = 1;
  let hasError = false;
  const chars = new Array(256).fill(null);
  const code = (char) => char.charCodeAt(0);
  chars[code("(")] = () => addToken(LEFT_PAREN2);
  chars[code(")")] = () => addToken(RIGHT_PAREN2);
  chars[code("{")] = () => addToken(LEFT_BRACE2);
  chars[code("}")] = () => addToken(RIGHT_BRACE2);
  chars[code("[")] = () => addToken(LEFT_BRACKET2);
  chars[code("]")] = () => addToken(RIGHT_BRACKET2);
  chars[code(",")] = () => addToken(COMMA2);
  chars[code(".")] = () => addToken(DOT2);
  chars[code("+")] = plus;
  chars[code("-")] = minus;
  chars[code(";")] = () => addToken(SEMICOLON2);
  chars[code("*")] = star;
  chars[code("!")] = bang;
  chars[code("=")] = equal;
  chars[code("<")] = less;
  chars[code(">")] = () => addToken(match("=") ? GREATER_EQUAL2 : GREATER2);
  chars[code(":")] = () => addToken(match(":") ? COLON_COLON2 : COLON2);
  chars[code("?")] = question;
  chars[code("|")] = pipe;
  chars[code("&")] = () => addToken(match("&") ? LOGICAL_AND2 : AMPERSAND2);
  chars[code("%")] = percent;
  chars[code('"')] = doubleQuoteString;
  chars[code("/")] = slash;
  chars[code(" ")] = () => {
  };
  chars[code("\r")] = () => {
  };
  chars[code("\t")] = () => {
  };
  chars[code(`
`)] = eol;
  return scanTokens();
  function scanTokens() {
    while (!isAtEnd()) {
      scanToken();
    }
    tokens.push(new Token(EOF2, "", null, line));
    if (hasError)
      throw new Error("Scanner error");
    return tokens;
  }
  function scanToken() {
    start = current;
    let c = advance();
    if (chars[code(c)])
      return chars[code(c)]();
    if (isDigit(c))
      return number();
    if (isAlpha(c))
      return identifier();
    console.error("Scanner error: unexpected character on line " + line);
    hasError = true;
  }
  function advance() {
    return source.charAt(current++);
  }
  function addToken(type, literal, text = source.substring(start, current)) {
    tokens.push(new Token(type, text, literal, line));
  }
  function match(expected) {
    if (isAtEnd())
      return false;
    if (source.charAt(current) !== expected)
      return false;
    current++;
    return true;
  }
  function plus() {
    if (match("="))
      addToken(PLUS_EQUAL2);
    else if (match("+"))
      addToken(PLUS_PLUS2);
    else if (match(".")) {
      if (match("="))
        addToken(PLUS_DOT_EQUAL2);
      else
        addToken(PLUS_DOT2);
    } else
      addToken(PLUS2);
  }
  function minus() {
    if (match("="))
      addToken(MINUS_EQUAL2);
    else if (match("-"))
      addToken(MINUS_MINUS2);
    else
      addToken(MINUS2);
  }
  function star() {
    if (match("*")) {
      if (match("="))
        addToken(STAR_STAR_EQUAL2);
      else
        addToken(STAR_STAR2);
    } else if (match("="))
      addToken(STAR_EQUAL2);
    else
      addToken(STAR2);
  }
  function slash() {
    if (match("/")) {
      while (peek() != `
` && !isAtEnd())
        advance();
    } else if (match("="))
      addToken(SLASH_EQUAL2);
    else
      addToken(SLASH2);
  }
  function percent() {
    if (match("="))
      addToken(PERCENT_EQUAL2);
    else
      addToken(PERCENT2);
  }
  function bang() {
    if (match("=")) {
      if (match("="))
        addToken(BANG_EQUAL_EQUAL2);
      else
        addToken(BANG_EQUAL2);
    } else
      addToken(BANG2);
  }
  function equal() {
    if (match("=")) {
      if (match("="))
        addToken(EQUAL_EQUAL_EQUAL2);
      else
        addToken(EQUAL_EQUAL2);
    } else if (match(">"))
      addToken(ARROW2);
    else
      addToken(EQUAL2);
  }
  function less() {
    if (match("=")) {
      if (match(">")) {
        addToken(SPACESHIP2);
      } else {
        addToken(LESS_EQUAL2);
      }
    } else {
      addToken(LESS2);
    }
  }
  function question() {
    if (match("?")) {
      if (match("="))
        addToken(NULL_COALESCE_EQUAL2);
      else
        addToken(NULL_COALESCE2);
    } else if (match(":"))
      addToken(ELVIS);
    else if (match("."))
      addToken(OPTIONAL_CHAIN2);
    else
      addToken(QUESTION2);
  }
  function pipe() {
    if (match("|")) {
      if (match("="))
        addToken(LOGICAL_OR_EQUAL2);
      else
        addToken(LOGICAL_OR2);
    } else
      addToken(PIPE2);
  }
  function doubleQuoteString() {
    let result = doubleQuoteStringParts();
    if (prevTokens(DOUBLE_QUOTE2, DOUBLE_QUOTE2)) {
      tokens.pop();
      tokens.pop();
      tokens.push(new Token(STRING2, "", "", line));
    } else if (prevTokens(DOUBLE_QUOTE2, STRING_PART2, DOUBLE_QUOTE2)) {
      tokens.pop();
      let string = tokens.pop();
      tokens.pop();
      tokens.push(new Token(STRING2, string.lexeme, string.literal, line));
    }
    return result;
  }
  function doubleQuoteStringParts() {
    addToken(DOUBLE_QUOTE2);
    start = current;
    while (!isAtEnd()) {
      doubleQuoteStringPart();
      if (peek() === '"')
        break;
      if (peek() === "$") {
        if (peekNext() === "{") {
          doubleQuoteStringExpression();
        } else if (isAlpha(peekNext())) {
          doubleQuoteStringIdentifier();
        }
      }
      start = current;
    }
    if (peek() !== '"') {
      console.error("Unterminated string on line " + line);
      hasError = true;
      return;
    }
    advance();
    addToken(DOUBLE_QUOTE2);
  }
  function doubleQuoteStringPart() {
    while (!isAtEnd()) {
      if (peek() === `
`)
        line++;
      if (peek() === '"')
        break;
      if (peek() === "$") {
        if (peekNext() === "{")
          break;
        if (isAlpha(peekNext()))
          break;
      }
      advance();
    }
    if (start !== current) {
      addToken(STRING_PART2, source.substring(start, current));
      start = current;
    }
  }
  function doubleQuoteStringIdentifier() {
    advance();
    start = current;
    identifier();
  }
  function doubleQuoteStringExpression() {
    advance();
    start = current;
    while (!isAtEnd()) {
      scanToken();
      if (prevTokens(RIGHT_BRACE2))
        break;
    }
    if (previous() !== "}") {
      console.error("Unterminated template expression on line " + line);
      hasError = true;
    }
  }
  function eol() {
    line++;
  }
  function number() {
    if (previous() === "0") {
      if ((peek() === "x" || peek() === "X") && isHexDigit(peekNext())) {
        advance();
        advance();
        return hexNumber();
      }
      if ((peek() === "o" || peek() === "O") && isOctalDigit(peekNext())) {
        advance();
        advance();
        return octalNumber();
      }
      if ((peek() === "b" || peek() === "B") && isBinaryDigit(peekNext())) {
        advance();
        advance();
        return binaryNumber();
      }
    }
    return decimalNumber();
  }
  function decimalNumber() {
    while (isDigitOr_(peek()))
      advance();
    if (peek() === "." && isDigit(peekNext())) {
      advance();
      advance();
      while (isDigitOr_(peek()))
        advance();
    }
    addToken(NUMBER2, source.substring(start, current).replaceAll("_", ""));
  }
  function hexNumber() {
    while (isHexDigitOr_(peek()))
      advance();
    addToken(NUMBER2, source.substring(start, current).replaceAll("_", ""));
  }
  function octalNumber() {
    while (isOctalDigitOr_(peek()))
      advance();
    addToken(NUMBER2, source.substring(start, current).replaceAll("_", ""));
  }
  function binaryNumber() {
    while (isBinaryDigitOr_(peek()))
      advance();
    addToken(NUMBER2, source.substring(start, current).replaceAll("_", ""));
  }
  function identifier() {
    while (isAlphaNumeric(peek()))
      advance();
    const text = source.substring(start, current);
    const type = keywords[text] ?? IDENTIFIER2;
    addToken(type);
  }
  function prevTokens(...checks) {
    for (let i = 0;i < checks.length; ++i) {
      let check = checks[i];
      let token = tokens[tokens.length - i - 1] ?? EOF2;
      if (check !== token.type)
        return false;
    }
    return true;
  }
  function previous() {
    if (current === 0)
      return "\x00";
    return source.charAt(current - 1);
  }
  function peek() {
    if (isAtEnd())
      return "\x00";
    return source.charAt(current);
  }
  function peekNext() {
    if (current + 1 >= source.length)
      return "\x00";
    return source.charAt(current + 1);
  }
  function isAtEnd() {
    return current >= source.length;
  }
  function isDigit(c) {
    return c >= "0" && c <= "9";
  }
  function isDigitOr_(c) {
    return isDigit(c) || c === "_";
  }
  function isHexDigit(c) {
    return isDigit(c) || c >= "a" && c <= "f" || c >= "A" && c <= "F";
  }
  function isHexDigitOr_(c) {
    return isHexDigit(c) || c === "_";
  }
  function isOctalDigit(c) {
    return c >= "0" && c <= "7";
  }
  function isOctalDigitOr_(c) {
    return isOctalDigit(c) || c === "_";
  }
  function isBinaryDigit(c) {
    return c === "0" || c === "1";
  }
  function isBinaryDigitOr_(c) {
    return isBinaryDigit(c) || c === "_";
  }
  function isAlpha(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "_";
  }
  function isAlphaNumeric(c) {
    return isAlpha(c) || isDigit(c);
  }
}
// parser/ParseError.ts
class ParseError2 extends Error {
}

// compiler/VoidVisitor.ts
class VoidVisitor {
  visitArrayAccess(node) {
    node.left.accept(this);
    node.index.accept(this);
  }
  visitArrayElement(node) {
    node.key?.accept(this);
    node.value.accept(this);
  }
  visitArrayLiteral(node) {
    for (let element of node.elements) {
      element.accept(this);
    }
  }
  visitAssign(node) {
    node.name.accept(this);
    node.value.accept(this);
  }
  visitBinary(node) {
    node.left.accept(this);
    node.right.accept(this);
  }
  visitBlock(node) {
    for (let statement of node.statements) {
      statement.accept(this);
    }
  }
  visitBooleanLiteral(node) {
  }
  visitCall(node) {
    node.callee.accept(this);
    node.args.forEach((arg) => arg.accept(this));
  }
  visitCatch(node) {
    node.body.accept(this);
  }
  visitClassAbstractMethod(node) {
    node.params.forEach((param) => param.accept(this));
  }
  visitClassConst(node) {
    node.initializer?.accept(this);
  }
  visitClassDeclaration(node) {
    node.params.forEach((param) => param.accept(this));
    node.superclass?.accept(this);
    node.iterates?.accept(this);
    node.members.forEach((member) => member.accept(this));
  }
  visitClassInitializer(node) {
    node.body.accept(this);
  }
  visitClassMethod(node) {
    node.params.forEach((param) => param.accept(this));
    node.body.accept(this);
  }
  visitClassProperty(node) {
    node.initializer?.accept(this);
  }
  visitClassSuperclass(node) {
    node.args.forEach((arg) => arg.accept(this));
  }
  visitClone(node) {
    node.expression.accept(this);
  }
  visitDestructuring(node) {
    node.elements.forEach((element) => element?.accept(this));
  }
  visitDestructuringElement(node) {
  }
  visitEcho(node) {
    node.expression.accept(this);
  }
  visitExpressionStatement(node) {
    node.expression.accept(this);
  }
  visitFor(node) {
    node.initializer?.accept(this);
    node.condition?.accept(this);
    node.increment?.accept(this);
    node.body.accept(this);
  }
  visitForeach(node) {
    node.iterable.accept(this);
    node.key?.accept(this);
    node.value.accept(this);
    node.body.accept(this);
  }
  visitForeachVariable(node) {
  }
  visitFunctionDeclaration(node) {
    node.params.forEach((param) => param.accept(this));
    node.body.accept(this);
  }
  visitFunctionExpression(node) {
    node.params.forEach((param) => param.accept(this));
    node.body.accept(this);
  }
  visitGetExpr(node) {
    node.object.accept(this);
  }
  visitGrouping(node) {
    node.expression.accept(this);
  }
  visitIdentifier(node) {
  }
  visitIf(node) {
    node.condition.accept(this);
    node.thenBranch.accept(this);
    node.elseBranch?.accept(this);
  }
  visitMatch(node) {
    node.subject.accept(this);
    node.arms.forEach((arm) => arm.accept(this));
    node.defaultArm?.accept(this);
  }
  visitMatchArm(node) {
    node.patterns.forEach((pattern) => pattern.accept(this));
    node.body.accept(this);
  }
  visitNew(node) {
    node.expression.accept(this);
  }
  visitNullLiteral(node) {
  }
  visitNumberLiteral(node) {
  }
  visitOptionalGet(node) {
    node.object.accept(this);
  }
  visitParam(node) {
    node.initializer?.accept(this);
  }
  visitPipeline(node) {
    node.left.accept(this);
    node.right.accept(this);
  }
  visitPostfix(node) {
    node.left.accept(this);
  }
  visitPrefix(node) {
    node.right.accept(this);
  }
  visitProgram(node) {
    for (let statement of node.statements) {
      statement.accept(this);
    }
  }
  visitReturn(node) {
    node.value?.accept(this);
  }
  visitScopeResolution(node) {
    node.left.accept(this);
  }
  visitStringLiteral(node) {
  }
  visitSuper() {
  }
  visitTemplateStringLiteral(node) {
    node.parts.forEach((part) => part.accept(this));
  }
  visitTernary(node) {
    node.condition.accept(this);
    node.left.accept(this);
    node.right.accept(this);
  }
  visitThis() {
  }
  visitThrowExpression(node) {
    node.expression.accept(this);
  }
  visitThrowStatement(node) {
    node.expression.accept(this);
  }
  visitTry(node) {
    node.tryBlock.accept(this);
    node.catches.forEach((catch_) => catch_.accept(this));
    node.finallyBlock?.accept(this);
  }
  visitUnary(node) {
    node.right.accept(this);
  }
  visitVarDeclaration(node) {
    node.initializer?.accept(this);
  }
  visitVarDestructuringDeclaration(node) {
    node.destructuring.accept(this);
    node.initializer.accept(this);
  }
  visitWhile(node) {
    node.condition.accept(this);
    node.body.accept(this);
  }
}

// parser/globalEnvironment.ts
var builtinEnvironment = new HoistedEnvironment;
var runtime = {
  map,
  sum
};
for (let key of Object.keys(runtime)) {
  builtinEnvironment.add(key, 8 /* PhinRuntimeFunction */);
}
builtinEnvironment.add("array_map", 3 /* Function */);
builtinEnvironment.add("array_push", 3 /* Function */);
builtinEnvironment.add("array_sum", 3 /* Function */);
builtinEnvironment.add("array", 3 /* Function */);
builtinEnvironment.add("count", 3 /* Function */);
builtinEnvironment.add("ArrayIterator", 4 /* Class */);
builtinEnvironment.add("DomainException", 4 /* Class */);
builtinEnvironment.add("Traversable", 4 /* Class */);
builtinEnvironment.add("Exception", 4 /* Class */);
function map() {
  return compile(`fun map(transform) => fun(arr: array) => array_map(transform, arr)`);
}
function sum() {
  return compile(`fun sum(arr: array) => array_sum(arr)`);
}

// compiler/BindIdentifiersVisitor.ts
function defaultResolveUndeclaredIdentifier(name) {
  if (builtinEnvironment.has(name)) {
    return builtinEnvironment.get(name);
  }
  throw new ParseError2(`Undeclared identifier: ${name}`);
}

class BindIdentifiersVisitor extends VoidVisitor {
  resolveUndeclaredIdentifier;
  env = new Environments;
  currentFunctionExpression = null;
  constructor(resolveUndeclaredIdentifier = defaultResolveUndeclaredIdentifier) {
    super();
    this.resolveUndeclaredIdentifier = resolveUndeclaredIdentifier;
  }
  visit(node) {
    this.env.wrap(node.environment, () => node.accept(this));
  }
  visitProgram(node) {
    let env = new LocalEnvironment;
    this.env.wrap(env, () => super.visitProgram(node));
  }
  visitClassDeclaration(node) {
    this.env.wrap(node.environment, () => super.visitClassDeclaration(node));
  }
  visitClassMethod(node) {
    let env = new LocalEnvironment;
    node.params.forEach((p) => env.add(p.name));
    this.env.wrap(env, () => super.visitClassMethod(node));
  }
  visitDestructuring(node) {
    super.visitDestructuring(node);
    node.elements.forEach((element) => {
      if (element)
        this.env.addLocal(element.value);
    });
  }
  visitForeachVariable(node) {
    this.env.addLocal(node.name);
  }
  visitFunctionDeclaration(node) {
    let env = new LocalEnvironment;
    node.params.forEach((p) => env.add(p.name));
    this.env.wrap(env, () => super.visitFunctionDeclaration(node));
  }
  visitFunctionExpression(node) {
    let env = new ClosureEnvironment(this.env.locals());
    node.params.forEach((p) => env.add(p.name));
    let prev = this.currentFunctionExpression;
    this.currentFunctionExpression = node;
    this.env.wrap(env, () => super.visitFunctionExpression(node));
    this.currentFunctionExpression = prev;
  }
  visitIdentifier(node) {
    let name = node.name;
    let kind = this.env.resolve(name) ?? this.resolveUndeclaredIdentifier(name);
    node.bind(kind);
    if (kind === 2 /* ClosureVariable */) {
      this.currentFunctionExpression?.addClosureVariable(name);
    }
  }
  visitVarDeclaration(node) {
    super.visitVarDeclaration(node);
    this.env.addLocal(node.name);
  }
}

class Environments {
  environments = [];
  env() {
    return this.environments[this.environments.length - 1];
  }
  resolve(identifier) {
    for (let i = this.environments.length - 1;i >= 0; i--) {
      let env = this.environments[i];
      let kind = env.get(identifier);
      if (kind != null)
        return kind;
    }
    return null;
  }
  locals() {
    let env = this.env();
    if (!(env instanceof LocalEnvironment)) {
      if (!(env instanceof ClosureEnvironment)) {
        throw new Error("Expected local environment");
      }
    }
    return env;
  }
  wrap(env, fn) {
    let locals = this.env() instanceof LocalEnvironment ? this.environments.pop() : null;
    this.environments.push(env);
    fn();
    this.environments.pop();
    if (locals != null)
      this.environments.push(locals);
  }
  addLocal(name) {
    this.locals().add(name);
  }
}

// compiler/compiler.ts
function compile(source, {
  resolveUndeclaredIdentifiers = defaultResolveUndeclaredIdentifier,
  buildEnvironment = true
} = {}) {
  let ast = parse(scan(source), { buildEnvironment });
  new BindIdentifiersVisitor(resolveUndeclaredIdentifiers).visit(ast);
  return ast;
}
// web/main.ts
console.log(compile('echo "Hello, World!";'));
