import { CoreConfig, CoreOption } from '../option'
import path from 'path'
import fs from 'fs-extra'
import { DefaultConfig } from '../option/default'
import { overrideDefaultMerge } from '../utils/merge'
import { WebpackBuilder } from '../builder'

export class App {
  private readonly options: CoreOption
  private readonly builder: WebpackBuilder

  constructor(options: CoreConfig = {}) {
    this.options = this.getMergedConfig(
      options,
      this.getCustomConfig(),
      DefaultConfig
    )
    this.builder = new WebpackBuilder(this.options)
  }

  static get CONFIG_FILENAME() {
    return 'simply.config.js'
  }

  static get CONFIG_KEY_PATH_TO_OVERRIDE() {
    return ['devServer.static']
  }

  getMergedConfig(...config: CoreConfig[]): CoreOption {
    return overrideDefaultMerge(App.CONFIG_KEY_PATH_TO_OVERRIDE)(
      {},
      ...config,
      { rootDir: process.cwd() }
    ) as CoreOption
  }

  // todo use glob
  // todo match *.js、*.ts、*.json etc.
  getCustomConfig(): CoreConfig {
    const cwd = process.cwd()
    const configFile = path.join(cwd, App.CONFIG_FILENAME)
    if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
      return require(configFile) as CoreConfig
    }
    return {}
  }

  async start() {
    await this.builder.run()
  }
}
