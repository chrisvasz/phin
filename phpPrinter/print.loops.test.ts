// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'
import { Kind } from './environment'

function print(src: string) {
  let result = new PhpPrinter(() => Kind.Var).print(parse(scan(src)))
  return result.trim()
}

describe('print foreach', () => {
  test('foreach (a as b) {}', () => {
    let source = 'foreach (a as b) {}'
    let expected = 'foreach ($a as $b) {}'
    expect(print(source)).toEqual(expected)
  })
})
