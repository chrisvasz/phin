// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as types from '../type';

function ast(source: string) {
  return parse(scan(source));
}

describe('try/catch', () => {
  test('try {} catch (e: Exception) {}', () => {
    let source = 'try {} catch (e: Exception) {}';
    let expected = [
      new stmt.Try([], [new stmt.Catch('e', ['Exception'], [])], null),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} finally {}', () => {
    let source = 'try {} finally {}';
    let expected = [new stmt.Try([], [], [])];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} catch (e: Exception) {} finally {}', () => {
    let source = 'try {} catch (e: Exception) {} finally {}';
    let expected = [
      new stmt.Try([], [new stmt.Catch('e', ['Exception'], [])], []),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} catch (e: A|B|C) {}', () => {
    let source = 'try {} catch (e: A|B|C) {}';
    let expected = [
      new stmt.Try([], [new stmt.Catch('e', ['A', 'B', 'C'], [])], null),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('try {} catch (e:A) {} catch (e:B) {}', () => {
    let source = 'try {} catch (e:A) {} catch (e:B) {}';
    let expected = [
      new stmt.Try(
        [],
        [new stmt.Catch('e', ['A'], []), new stmt.Catch('e', ['B'], [])],
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('throw', () => {
  test('throw e', () => {
    let source = 'throw e';
    let expected = [new stmt.Throw(new expr.Variable('e'))];
    expect(ast(source)).toEqual(expected);
  });

  test('throw new Exception()', () => {
    let source = 'throw new Exception()';
    let expected = [
      new stmt.Throw(
        new expr.New(new expr.Call(new expr.Variable('Exception'), [])),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var a = throw e', () => {
    let source = 'var a = throw e';
    let expected = [
      new stmt.Var('a', null, new expr.Throw(new expr.Variable('e'))),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
