const http = require('http')

// 只解析content-type为application/json类型的数据
const bodyParser = (req) => {
  return new Promise((resolve) => {
    if(req.method !== 'POST'){
      return resolve({})
    }
    if(req.headers['content-type'] !== 'application/json'){
      return resolve({})
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      resolve(JSON.parse(postData))
    })
  })
}

const server = http.createServer(async (req, res) => {


  res.setHeader('Content-type', 'application/json')
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-log-bodyrawsize");

  req.body = await bodyParser(req)
  console.log('req.body..', req.body)
  res.end('日志上报成功！')

})

server.listen(8003)
