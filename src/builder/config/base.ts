import * as path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { RuleSetRule, Configuration } from 'webpack'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import chalk from 'chalk'
import { WebpackMode } from '../types'
import { CoreOption, WebpackRunMode } from '../../option'
import camelcase from 'camelcase'

// todo apply webpack config from CoreConfig
export class WebpackBaseConfig {
  constructor(private readonly options: CoreOption) {}

  get modeMapping(): Record<WebpackRunMode, WebpackMode> {
    return {
      dev: 'development',
      prod: 'production',
      analyze: 'production',
    }
  }

  get mode(): WebpackMode {
    return this.modeMapping[this.options.mode]
  }

  entry() {
    return './src/main'
  }

  output() {
    return {
      filename: '[name].bundle.js',
      path: path.resolve(this.options.rootDir, 'dist'),
      publicPath: '/',
    }
  }

  alias() {
    return {
      '@': path.join(this.options.rootDir, 'src'),
      // xxx preact support
      // react: 'preact/compat',
      // 'react-dom/test-utils': 'preact/test-utils',
      // 'react-dom': 'preact/compat',
      // 'react/jsx-runtime': 'preact/jsx-runtime',
    }
  }

  resolve() {
    return {
      alias: this.alias(),
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.wasm'],
    }
  }

  babelLoader() {
    return {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: 'defaults' }],
          '@babel/preset-react',
          [
            '@babel/preset-typescript',
            { jsxPragma: 'React.h', jsxPragmaFrag: 'React.Fragment' },
          ],
        ],
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              pragma: 'React.h',
              pragmaFrag: 'React.Fragment',
            },
          ],
          ['@babel/plugin-transform-runtime', { corejs: 3 }],
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-private-methods',
          '@umijs/babel-plugin-auto-css-modules',
        ],
      },
    }
  }

  rules(): RuleSetRule[] {
    const postcssLoader = {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            postcssPresetEnv({
              browsers: [
                'last 2 version',
                '>1%',
                'ios 7',
                'maintained node versions',
              ],
            }),
          ],
        },
      },
    }
    const lessLoader = {
      loader: 'less-loader',
      options: {
        additionalData: `@import "@/styles/variables.less";`,
        lessOptions: {
          javascriptEnabled: true,
          strictMath: true,
        },
      },
    }

    return [
      {
        test: /\.m?js|tsx?$/i,
        type: 'javascript/auto',
        exclude: (file: string) => {
          file = file.split(/node_modules(.*)/)[1]
          return !!file
        },
        use: [this.babelLoader()],
      },
      {
        oneOf: [
          {
            test: /\.css|less$/,
            resourceQuery: /modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: 'bl-[local]',
                    exportLocalsConvention: 'camelCase',
                  },
                },
              },
              postcssLoader,
              lessLoader,
            ],
          },
          {
            test: /\.css|less$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              postcssLoader,
              lessLoader,
            ],
          },
        ],
      },
    ]
  }

  plugins(): any[] {
    return [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: 'Simply',
        template: path.join(this.options.rootDir, 'public/index.html'),
      }),
      this.progressBarPlugin(),
    ]
  }

  optimization() {
    return {}
  }

  progressBarPlugin() {
    return new ProgressBarPlugin({
      format: [
        chalk.black.bgGreen.bold(
          ` ${camelcase(this.options.mode, { pascalCase: true })} `
        ),
        chalk.green(':bar'),
        ':msg',
        chalk.green.bold(':percent'),
      ].join(' '),
      clear: true,
      complete: '█',
      total: 100,
    })
  }

  config(): Configuration {
    return {
      mode: this.mode,
      entry: this.entry(),
      output: this.output(),
      resolve: this.resolve(),
      module: {
        rules: this.rules(),
      },
      plugins: this.plugins(),
      stats: 'errors-only',
      performance: false,
      infrastructureLogging: {
        level: 'error',
      },
      optimization: this.optimization(),
    }
  }
}
