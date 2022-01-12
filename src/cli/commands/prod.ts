import { CMDDefinition } from '../types'
import { CoreConfig, CustomConfigReader, mergeConfig } from '../../option'
import { App } from '../../core'
import { WebpackBuilder } from '../../builder'

export const cmd: CMDDefinition = {
  name: 'prod',
  params: {
    root: {
      alias: 'r',
      type: 'string',
    },
    debug: {
      type: 'number',
    },
    analyze: {
      type: 'boolean',
      default: false,
    },
  },
  async run(args = {}) {
    const cmdConfig: CoreConfig = {
      rootDir: args.root,
      mode: 'prod',
      debug: args.debug || false,
      analyze: args.analyze || false,
    }
    const customConfig = CustomConfigReader.readCustomConfig()
    // todo env config
    const options = mergeConfig(cmdConfig, customConfig)
    const app = new App(options)
    const builder = new WebpackBuilder(app)
    await builder.run()
  },
}
