import { CMDDefinition } from '../types'
import { cmd as ProdCmd } from './prod'

export const cmd: CMDDefinition = {
  name: 'analyze',
  params: {
    root: {
      alias: 'r',
      type: 'string',
    },
    debug: {
      type: 'number',
    },
    config: {
      alias: 'c',
      type: 'string',
    },
  },
  async run(args) {
    return ProdCmd.run({ ...args, analyze: true })
  },
}
