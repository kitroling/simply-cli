import path from 'path'
import { CoreConfig } from './index'
import fs from 'fs-extra'

export class CustomConfigReader {
  static get CONFIG_FILENAME() {
    return 'simply.config.js'
  }
  static readCustomConfig(file?: string) {
    const configFile =
      file || path.join(process.cwd(), CustomConfigReader.CONFIG_FILENAME)
    if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
      return require(configFile) as CoreConfig
    }
    return {}
  }
}
