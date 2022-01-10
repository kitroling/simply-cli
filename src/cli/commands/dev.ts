import { CMDDefinition } from '../types'

export const cmd: CMDDefinition = {
  params: {
    port: {
      alias: 'p',
      type: 'number',
      default: 9000,
    },
    host: {
      alias: 'h',
      type: 'string',
      default: 'localhost',
    },
    open: {
      type: 'boolean',
      default: false,
    },
    static: {
      type: 'string',
      default: 'public',
      array: true,
    },
    debug: {
      type: 'number',
      default: 9222,
    },
  },
}
