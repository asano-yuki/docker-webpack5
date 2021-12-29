# 目的
DockerでWebpack5 + Reactの開発環境を構築する。また、
webpack-dev-serverをHMRで動作させる。

# ポイント
## docker-compose.yml
docker-compose.ymlに`CHOKIDAR_USEPOLLING=true`を記述
```
environment:
  - CHOKIDAR_USEPOLLING=true
```
## package.json
以下のパッケージをインストール
```
yarn add -D react-hot-loader @hot-loader/react-dom
```
## webpack.config.js
コンテナ上のローカルサーバーにアクセスするための指定
```
devServer: {
  host: '0.0.0.0'
},
```
react-domにHMRを追加するためにエイリアスを指定
```
resolve: {
  alias: {
    'react-dom': '@hot-loader/react-dom'
  }
}
```
webpack5ではtargetに配列指定するとHMRが効かないので値を切り替える
```
target: args.mode === 'development' ? 'web' : ['web', 'es5']
```
コンテナの規模が大きくなるとHMRが正常に動作しない場合があるのでポーリングを指定して対応
```
watchOptions: {
  aggregateTimeout: 600,
  poll: 1000
}
```
## Reactの記述
HMRを適用させたいコンポーネントを`hot`でラップする
```
import { hot } from 'react-hot-loader/root'
const App = () => { ... }
export default hot(App)
```
