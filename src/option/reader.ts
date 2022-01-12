import path from 'path'
import { CoreConfig } from './index'
import fs from 'fs-extra'

export class ConfigReader {
  static get CONFIG_FILENAME() {
    return 'simply.config.js'
  }

  static readConfig(rootDir?: string): CoreConfig {
    rootDir = rootDir || process.cwd()
    const configFile = path.join(rootDir, ConfigReader.CONFIG_FILENAME)
    return this.readCustomConfig(configFile)
  }

  static readCustomConfig(file: string): CoreConfig {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return require(file) as CoreConfig
    }
    return {}
  }
}
