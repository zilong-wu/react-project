// 上传视频逻辑比较复杂，so自定义个组件，包裹antd中upload组件，那么对应的上传的逻辑都写在这个组件中
import React, { Component } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
// 请求token方法
import { reqGetQiniuToken } from '@api/edu/lesson'

const MAX_VIDEO_SIZE = 2 * 1024 * 1024
export default class MyUpload extends Component {
  state = {
    uploadToken: '',
    expires: 0
  }
  // 上传视频前调用
  // 在上传视频之前要做的两件事
  handleBeforeUpload = (file, fileList) => {
    // console.log(file)
    return new Promise((resolve, reject) => {
      // 1. 限制视频的大小
      if (file.size > MAX_VIDEO_SIZE) {
        message.error('视频太大，不能超过2m')
        reject('视频太大，不能超过2m')
        return  // 由于reject后面代码还会执行所有return
      }

      // console.log(111) // 执行reject后也会执行

      // 2. 请求上传的token
      // 判断本地缓存中是否有token，有则判断是否过期，没有则不发送
      // (1) 从缓存中获取数据
      const str = localStorage.getItem('upload_token')

      // 判断str有值，说明缓存过。没有则没请求过token，直接去请求
      if (!str) {
        this.saveUploadToken()
      } else {
        const uploadObj = JSON.parse(str)
        // (2) 判断token是否过期 token有效期是7200
        //  注意：返回的expires是秒数，需要变成毫秒进行判断

        // 如何判断有没有超时
        //  - 获取当前时间
        //  Date.now()
        //  - 获取存储token的过期目标时间
        //  uploadObj.expires
        //  - 比较
        if (Date.now() > uploadObj.expires) {
          // 过期了，重新发送请求
          this.saveUploadToken()
        }
      }
      return resolve(file)
    })
  }

  // 存储uploadToken和过期时间
  saveUploadToken = async () => {
    // 1. 发送请求拿到token
    const res = await reqGetQiniuToken()
    console.log(res)
    // 获取到token的时间 + 时间周期 = 过期的目标时间
    const targetTime = Date.now() + res.expires * 1000
    res.expires = targetTime
    // 2. 存储到本地缓存中
    const upload_token = JSON.stringify(res)
    localStorage.setItem('upload_token', upload_token)
    // 3. 存储到state里面
    this.setState(res)
  }
  // 真正上传视频时的调用，这个函数会覆盖默认的上传方式
  handleCustomRequest = () => {
    console.log('上传了')
  }
  render () {
    return (
      <Upload
        beforeUpload={this.handleBeforeUpload}
        customRequest={this.handleCustomRequest}
      >
        <Button>
          <UploadOutlined /> 上传视频
          </Button>
      </Upload>
    )
  }
}
