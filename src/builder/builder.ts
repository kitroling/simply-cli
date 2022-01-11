import webpack from 'webpack'
import { WebpackDevConfig } from './config/dev'
import { WebpackProdConfig } from './config/prod'
import { WebpackAnalyzeConfig } from './config/analyze'
import DevServer from 'webpack-dev-server'
import { ConfigType } from './types'
import chalk from 'chalk'
import { AddressInfo } from 'net'
import * as url from 'url'
import { CoreOption, WebpackRunMode } from '../option'

// todo debug mode
export class WebpackBuilder {
  constructor(private readonly options: CoreOption) {}

  private devServer!: DevServer

  get mode() {
    return this.options.mode
  }

  get isDev() {
    return this.mode === 'dev'
  }

  async run() {
    const config = this.getConfig()
    const compiler = webpack(config)
    const startCompile = this.isDev
      ? this.runDevCompiler(compiler)
      : this.runCompiler(compiler)
    const waitCompiled = new Promise<any>(resolve => {
      compiler.hooks.done.tap('load-resources', resolve)
    })
    await Promise.all([startCompile, waitCompiled])
    this.isDev && this.printFriendlyDevModeMessage()
  }

  printFriendlyDevModeMessage() {
    console.log(
      chalk.gray('Compiled successfully.\nWaiting for file changes...')
    )
    const addressInfo = this.devServer.server?.address?.() as AddressInfo
    if (addressInfo) {
      console.log(
        chalk.bold.black('Listening on:'),
        chalk.blue(
          url.format({
            protocol: 'http',
            port: addressInfo.port,
            hostname: addressInfo.address,
          })
        )
      )
    } else {
      throw new Error('No address')
    }
  }

  getConfig() {
    const configs: Record<WebpackRunMode, ConfigType> = {
      dev: WebpackDevConfig,
      prod: WebpackProdConfig,
      analyze: WebpackAnalyzeConfig,
    }
    const config = new configs[this.mode](this.options)
    return config.config()
  }

  private runCompiler(compiler: webpack.Compiler) {
    return new Promise((resolve, reject) => {
      compiler.run(err => {
        if (err) reject(err)
        else resolve(compiler)
      })
    })
  }

  private async runDevCompiler(compiler: webpack.Compiler) {
    const devServer = new DevServer(this.options.devServer, compiler)
    this.devServer = devServer
    await devServer.start()
    return compiler
  }
}
