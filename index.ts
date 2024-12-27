// @ts-ignore
import src from './sample.phlank' with { type: 'text' } // @ts-ignore
// @ts-ignore
import { $ } from 'bun'
import parse from './parser'
import scan from './scanner'
import { TokenType } from './token'
import { PhpPrinter } from './phpPrinter/print'

let tokens = scan(src)
let ast = parse(tokens)

let php = new PhpPrinter().print(ast)
await $`php -r ${php}`
