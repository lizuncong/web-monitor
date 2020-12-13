const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  context: process.cwd(),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'web-monitor-sdk.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head'
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    before(router){
      router.get('/success', function(req, res){
        res.json({ id: 1, })
      })
      router.post('/error', function(req, res){
        res.sendStatus(500)
      })
    }
  }
}
