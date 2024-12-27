// @ts-ignore
import src from './movie.phlank' with { type: 'text' }
// @ts-ignore
import { $ } from 'bun'
import parse from './parser'
import scan from './scanner'
import { PhpPrinter } from './phpPrinter/print'
// @ts-ignore
const Bun: any = globalThis.Bun

let tokens = scan(src)
let ast = parse(tokens)

let php = new PhpPrinter().print(ast)
const out = Bun.file('movie.compiled.php')
await Bun.write(out, '<?php\n' + php)
await $`php -r ${php}`
