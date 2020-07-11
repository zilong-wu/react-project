//用node的express的框架，快速搭建一个服务器
const express = require('express')
// 引入mockjs
const Mock = require('mockjs')
// 从Mock身上拿到Random对象
const Random = Mock.Random
//返回中文标题
Random.ctitle()

// 创建一个服务对象
const app = express()

// 解决跨域
// use是express中的一个中间件
app.use((req, res, next) => {
  //设置响应头
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'content-type,token')
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  //调用下一个中间件
  next()
})

// 配置路由规则，监听路径
app.get('/admin/edu/subject/:page/:limit', (req, res) => {
  // req 请求对象
  // 获取浏览器上传的路由参数
  let { page, limit } = req.params

  const data = Mock.mock({
    total: Random.integer(+limit + 2, limit * 2),
    [`items|${limit}`]: [
      {
        '_id| +1': 1,
        // 返回2-5个中文
        title: '@ctitle(2,5)',
        parentId: 0
      }
    ]
  })
  // res是响应对象
  res.json({
    code: 20000,
    success: true,
    data,
    message: ''
  })

})

// 开启服务
// 参数一： 服务器的端口号
// 参数二： 开启成功/失败的回调函数
app.listen(8888, (err) => {
  if (err) {
    return '服务启动失败'
  }
  console.log('服务已经启动,8888端口监听中')
})