import compile from '../compiler'
import { PhpPrinter } from '../phpPrinter/print'

// @ts-ignore
const { Bun, process } = globalThis

async function go() {
  let className = Bun.argv[2]
  let file = Bun.file(`${className}.phin`)
  let src = await file.text()

  let php = ''
  try {
    let ast = compile(src)
    php = new PhpPrinter().print(ast)
  } catch (e: any) {
    console.error(e)
    process.exit(1)
  }
  const out = Bun.file(`.phin/${className}.php`)
  await Bun.write(out, '<?php\n' + php)
}

go()
