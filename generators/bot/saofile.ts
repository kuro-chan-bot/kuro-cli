import * as path from 'path'
import { random } from 'superb'
import spawn from 'cross-spawn'

module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'Project name',
        default: '{outFolder}'
      },
      {
        name: 'description',
        message: 'Project description',
        default: `My ${random()} project`
      },
      {
        name: 'author',
        type: 'string',
        message: 'Author name',
        default: '{gitUser.name}',
        store: true
      },
      {
        name: 'prefix',
        message: 'Bot command prefix',
        default: '$'
      },
      {
        name: 'pm',
        message: 'Choose the package manager',
        choices: [
          { name: 'Yarn', value: 'yarn' },
          { name: 'Npm', value: 'npm' }
        ],
        type: 'list',
        default: 'yarn'
      },
      {
        name: 'language',
        message: 'Choice programming language',
        type: 'list',
        choices: [
          {
            name: 'TypeScript',
            value: 'typescript'
          },
          {
            name: 'JavaScript',
            value: 'javascript'
          }
        ],
        default: 'typescript'
      },
      {
        name: 'plugins',
        message: 'Choice plugins',
        type: 'checkbox',
        choices: [
          {
            name: 'Standard Plugin',
            value: 'standardPlugin'
          }
        ],
        default: []
      },
      {
        name: 'linter',
        message: 'Choice linting tools',
        type: 'checkbox',
        choices: [
          {
            name: 'ESLint',
            value: 'eslint'
          },
          {
            name: 'Prettier',
            value: 'prettier'
          }
        ],
        default: []
      }
    ]
  },
  templateData() {
    const typescript = this.answers.language === 'typescript'
    const javascript = this.answers.language === 'javascript'
    const standardPlugin = this.answers.plugins.includes('standardPlugin')
    const eslint = this.answers.linter.includes('eslint')
    const prettier = this.answers.linter.includes('prettier')
    const prefixes = this.answers.prefix ? this.answers.prefix : ''

    let ext = ''
    let startScript = ''
    if (typescript) {
      ext = 'ts'
      startScript = 'ts-node src/bot.ts'
    } else if (javascript) {
      ext = 'js'
      startScript = 'node src/bot.ts'
    }

    return {
      name: 'test',
      typescript,
      javascript,
      standardPlugin,
      ext,
      startScript,
      eslint,
      prettier,
      prefixes
    }
  },
  actions() {
    const actions: any[] = [
      {
        type: 'add',
        files: '**',
        templateDir: path.resolve(__dirname, '../../template/bot'),
        filters: {
          '**/*.ts': 'language === "typescript"',
          '**/*.js': 'language === "javascript"',
          'tsconfig.json': 'language === "typescript"',
          '.eslintrc': 'linter.includes("eslint")',
          '.prettierrc': 'linter.includes("prettier")'
        }
      },
      {
        type: 'move',
        patterns: {
          '_package.json': 'package.json',
          'nodemon.json': 'nodemon.json',
          gitignore: '.gitignore',
          'README.md': 'README.md'
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler(data) {
          delete data.scripts['']
          delete data.dependencies['']
          delete data.devDependencies['']
          return data
        }
      }
    ]

    return actions
  },
  async completed() {
    this.gitInit()

    await this.npmInstall({ npmClient: this.answers.pm })

    if (this.answers.linter.includes('eslint')) {
      const options = ['run', 'lint', '--', '--fix']
      if (this.answers.pm === 'yarn') {
        options.splice(2, 1)
      }
      spawn.sync(this.answers.pm, options, {
        cwd: this.outDir,
        stdio: 'inherit'
      })
    }
  }
}
