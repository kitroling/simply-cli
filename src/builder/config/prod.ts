import { WebpackBaseConfig } from './base'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

export class WebpackProdConfig extends WebpackBaseConfig {
  optimization() {
    return {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: {
            condition: 'some',
            filename: 'LICENSES.txt',
          },
          terserOptions: {
            compress: {
              ecma: 2015,
              warnings: false,
              comparisons: true,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'async',
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          common: {
            minChunks: 2,
            priority: -20,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      },
    }
  }

  plugins() {
    return [
      ...super.plugins(),
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: '**/*',
            context: 'public',
            globOptions: {
              ignore: ['**/*.html'],
            },
          },
        ],
      }),
    ]
  }
}
