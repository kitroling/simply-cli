import { CoreConfig, CoreOption, mergeConfig } from '../option'
import { DefaultConfig } from '../option/default'

export class App {
  public readonly options!: CoreOption
  constructor(options: CoreConfig) {
    const baseConfig: CoreConfig = {
      rootDir: process.cwd(),
    }
    this.options = mergeConfig(options, DefaultConfig, baseConfig) as CoreOption
  }
}
