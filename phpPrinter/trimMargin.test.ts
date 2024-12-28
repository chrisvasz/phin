// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { trimMargin } from './trimMargin'

test('trimMargin', () => {
  let s = `
    class A {
      function a() {}
    }
  `
  let expected = 'class A {\n  function a() {}\n}'
  expect(trimMargin(s)).toEqual(expected)
})
