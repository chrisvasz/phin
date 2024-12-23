// @ts-ignore
import { expect, test } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import { PhpPrinter } from '../PhpPrinter';

function print(source: string): string {
  let tokens = scan(source);
  let ast = parse(tokens);
  return new PhpPrinter().printStatements(ast);
}
