import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackProdConfig } from './prod'

export class WebpackAnalyzeConfig extends WebpackProdConfig {
  plugins() {
    return [...super.plugins(), new BundleAnalyzerPlugin()]
  }
}
