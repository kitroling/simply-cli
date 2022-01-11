import { WebpackBaseConfig } from './base'

export class WebpackDevConfig extends WebpackBaseConfig {
  optimization() {
    return {
      minimize: false,
    }
  }
}
