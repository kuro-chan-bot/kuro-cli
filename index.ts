#!/usr/bin/env node
import { cac } from 'cac'
import sao from 'sao'
import chalk from 'chalk'
import * as path from 'path'
const { version } = require('./package.json')

const cli = cac('kuro')

cli
  .command(
    'bot [out-dir]',
    'Generate in a custom directory or current directory'
  )
  .action((outDir = '.', cliOptions: any) => {
    console.log(chalk`{red Kuro CLI v${version}}`)
    console.log(chalk`✨  Generating KuroFramework project in {cyan ${outDir}}`)

    sao({
      generator: path.resolve(__dirname, './generators/bot'),
      outDir,
      cliOptions
    })
      .run()
      .catch(error => {
        console.trace(error)
        process.exit(1)
      })
  })

cli.help()
cli.version(version)
cli.parse()
