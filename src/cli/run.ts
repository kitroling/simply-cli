import minimist from 'minimist'
import { WebpackBuilder, WebpackRunMode } from '../builder'
import Commands from './commands'

export const run = async () => {
  const argv = process.argv.slice(2)
  const {
    _: [mode = 'dev'],
  } = minimist(argv, { stopEarly: true })
  const defs = Commands[mode]
  if (defs) {
    const opts = {
      string: [] as string[],
      boolean: [] as string[],
      alias: {} as Record<string, string | string[]>,
      default: {} as Record<string, any>,
    }
    for (const key in defs.params) {
      const def = defs.params[key]
      switch (def.type) {
        case 'string':
          opts.string.push(key)
          break
        case 'boolean':
          opts.boolean.push(key)
          break
      }
      if (def.alias) {
        opts.alias[key] = def.alias
      }
      if (Object.prototype.hasOwnProperty.call(def, 'default')) {
        opts.default[key] = def.default
      }
    }
    const { _, ...options } = minimist(argv, opts)

    for (const key in defs.params) {
      if (defs.params[key].array) {
        const val = options[key]
        if (!Array.isArray(val)) {
          options[key] = val ? [val] : []
        }
      }
    }

    const builder = new WebpackBuilder()
    await builder.run(mode as WebpackRunMode, options)
  } else {
    throw new Error('Unknown command')
  }
}
