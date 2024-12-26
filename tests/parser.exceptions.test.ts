// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as nodes from '../nodes';

function ast(source: string) {
  return parse(scan(source));
}

function block(...statements: nodes.Stmt[]) {
  return new nodes.Block(statements);
}

describe('try/catch', () => {
  test('try {} catch (e: Exception) {}', () => {
    let source = 'try {} catch (e: Exception) {}';
    let expected = [
      new nodes.Try(
        block(),
        [new nodes.Catch('e', ['Exception'], block())],
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} finally {}', () => {
    let source = 'try {} finally {}';
    let expected = [new nodes.Try(block(), [], block())];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} catch (e: Exception) {} finally {}', () => {
    let source = 'try {} catch (e: Exception) {} finally {}';
    let expected = [
      new nodes.Try(
        block(),
        [new nodes.Catch('e', ['Exception'], block())],
        block(),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} catch (e: A|B|C) {}', () => {
    let source = 'try {} catch (e: A|B|C) {}';
    let expected = [
      new nodes.Try(
        block(),
        [new nodes.Catch('e', ['A', 'B', 'C'], block())],
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} catch (e:A) {} catch (e:B) {}', () => {
    let source = 'try {} catch (e:A) {} catch (e:B) {}';
    let expected = [
      new nodes.Try(
        block(),
        [
          new nodes.Catch('e', ['A'], block()),
          new nodes.Catch('e', ['B'], block()),
        ],
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {a();} finally{b();}', () => {
    let source = 'try {a();} finally{b();}';
    let expected = [
      new nodes.Try(
        block(
          new nodes.ExpressionStatement(
            new nodes.Call(new nodes.Identifier('a'), []),
          ),
        ),
        [],
        block(
          new nodes.ExpressionStatement(
            new nodes.Call(new nodes.Identifier('b'), []),
          ),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('throw', () => {
  test('throw e', () => {
    let source = 'throw e';
    let expected = [new nodes.ThrowStatement(new nodes.Identifier('e'))];
    expect(ast(source)).toEqual(expected);
  });

  test('throw new Exception()', () => {
    let source = 'throw new Exception()';
    let expected = [
      new nodes.ThrowStatement(
        new nodes.New(new nodes.Call(new nodes.Identifier('Exception'), [])),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var a = throw e', () => {
    let source = 'var a = throw e';
    let expected = [
      new nodes.VarDeclaration(
        'a',
        null,
        new nodes.ThrowExpression(new nodes.Identifier('e')),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
