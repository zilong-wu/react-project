// 上传视频逻辑比较复杂，so自定义个组件，包裹antd中upload组件，那么对应的上传的逻辑都写在这个组件中
import React, { Component } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
// 引入
import * as qiniu from 'qiniu-js'
import { nanoid } from 'nanoid'
// 请求token方法
import { reqGetQiniuToken } from '@api/edu/lesson'

const MAX_VIDEO_SIZE = 20 * 1024 * 1024
export default class MyUpload extends Component {

  // 定义一个构造函数
  // 构造函数中只是从缓存中获取数据/定义状态
  constructor() {
    super()
    // 一进来就要从缓存中获取有没有token
    const str = localStorage.getItem('upload_token')
    if (str) {
      // 如果有内容字符串，说明之前存储过token
      // (没必要在这里判断，只需把从缓存中拿到的值，赋值给state)
      const res = JSON.parse(str)
      this.state = {
        uploadToken: res.uploadToken,
        expires: res.expires
      }
    } else {
      // 如果没有内容 undefined, 没有存储过
      this.state = {
        uploadToken: '',
        expires: 0
      }
    }
  }

  // 上传视频前调用
  // 在上传视频之前要做的两件事
  handleBeforeUpload = (file, fileList) => {
    // console.log(file,fileList)
    return new Promise(async (resolve, reject) => {
      // 1. 限制视频的大小
      if (file.size > MAX_VIDEO_SIZE) {
        message.error('视频太大，不能超过2m')
        reject('视频太大，不能超过2m')
        return  // 由于reject后面代码还会执行所有return
      }
      // 在请求之前，只需要判断token是否过期
      if (Date.now() > this.state.expires) {
        // 过期就重新获取
        const { uploadToken, expires } = await reqGetQiniuToken()
        // 将数据存储进来
        // state里面有最新数据，本地缓存中也有最新数据
        this.saveUploadToken(uploadToken, expires)
      }
      return resolve(file)
    })
  }

  // 存储uploadToken和过期时间
  saveUploadToken = (uploadToken, expires) => {
    // 获取到token的时间 + 时间周期 = 过期的目标时间
    // 注意：七牛云创建token就已经开始计时，当浏览器得到token的时候，可能时间已经过去很久了，所有计算目标过期时间的时候，要把刚才那段时间考虑进去
    // 实现：在计算出来的目标时间的基础上，减去一段
    const targetTime = Date.now() + expires * 1000 - 2 * 60 * 1000
    expires = targetTime

    // 2. 存储到本地缓存中
    const upload_token = JSON.stringify({ uploadToken, expires })
    localStorage.setItem('upload_token', upload_token)
    // 3. 存储到state里面
    this.setState({ uploadToken, expires })
  }

  // 真正上传视频时的调用，这个函数会覆盖默认的上传方式
  handleCustomRequest = (value) => {
    console.log(value)
    // 要上传的文件对象
    const file = value.file
    // key 到七牛云的文件名
    const key = nanoid(10)
    // token就是七牛云返回的token
    const token = this.state.uploadToken
    // putExtra 上传的额外配置项，可以配置上传的区域
    // 后台限制上传文件的类型，不是视频就不能上传成功
    const putExtra = {
      // 可以上传所有格式的视频
      mimeType: "video/*"
    }
    // config配置项，可以控制上传到哪个区域
    const config = {
      region: qiniu.region.z2
    }
    const observable = qiniu.upload(file, key, token, putExtra, config)
    // 监听对应时机的钩子
    const observer = {
      next (res) {
        console.log(res)
        // 由于res.total是个对象，并且有percent属性，可以展示进度条
        value.onProgress(res.total)
      },
      error (err) {
        console.log(err)
        // 上传失败调用onError,会展示一个错误的样式
        value.onError(err)
      },
      complete: (res) => {
        console.log(res)
        // 上传成功会调用，展示一个上传成功的样式
        value.onSuccess(res)
        // 注意： 解决视频上传成功，表单验证不通过的问题
        // 手动调用From.Item中传递过来的onChange方法，onChange方法接收需要表单控制的数据
        // 数据就是：未来要跟本地服务器存储的实际是上传视频成功的地址
        this.props.onChange(`http://qdcdb1qpp.bkt.clouddn.com/${res.key}`)
      }
    }
    this.subscription = observable.subscribe(observer) // 上传开始
  }

  // 如果组件卸载，上传取消
  componentWillUnmount () {
    // console.log(this);
    this.subscription && this.subscription.unsubscribe() // 上传取消
  }

  render () {
    return (
      <Upload
        beforeUpload={this.handleBeforeUpload}
        customRequest={this.handleCustomRequest}
        accept="video/*"  // 前端控制上传视频类型，不是视频类型就看不到
      >
        <Button>
          <UploadOutlined /> 上传视频
          </Button>
      </Upload>
    )
  }
}
