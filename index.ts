// @ts-ignore
import src from './movie.phlank' with { type: 'text' }
// @ts-ignore
import { $ } from 'bun'
import parse from './parser'
import scan from './scanner'
import { PhpPrinter } from './phpPrinter/print'
// @ts-ignore
const Bun: any = globalThis.Bun

let php = ''
let hasError = false
try {
  let tokens = scan(src)
  let ast = parse(tokens)
  php = new PhpPrinter().print(ast)
} catch (e: any) {
  console.error(e)
  php = e.message
  hasError = true
}
const out = Bun.file('movie.compiled.php')
await Bun.write(out, '<?php\n' + php)
if (!hasError) {
  await $`php -r ${php}`
}
