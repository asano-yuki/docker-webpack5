const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, args) => {
  return {
    mode: args.mode,
    entry: './src/index.jsx',
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react'
                ]
              }  
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        // react-domにHMRを追加するためのエイリアス
        'react-dom': '@hot-loader/react-dom'
      }
    },
    // コンテナの規模が大きくなるとHMRが正常に動作しない場合があるのでポーリングを指定して対応
    watchOptions: {
      aggregateTimeout: 600,
      poll: 1000
    },
    // webpack5ではtargetに配列指定するとHMRが効かないので値を切り替える
    target: args.mode === 'development' ? 'web' : ['web', 'es5'],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      // コンテナ上のローカルサーバーにアクセスするために'0.0.0.0'を指定
      host: '0.0.0.0',
      port: 3000,
      hot: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html')
      })
    ]
  }
}