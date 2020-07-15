// 上传视频逻辑比较复杂，所以自定义个组件，包裹antd中upload组件，那么对应的上传的逻辑都写在这个组件中
import React, { Component } from 'react'
import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { reqGetQiniuToken } from '@api/edu/lesson'

// import { reqGetQiniuToken } from '@api/edu/lesson'

// const MAX_VIDEO_SIZE = 2 * 1024 * 1024
export default class MyUpload extends Component {
  //   // 定义构造函数
  //   // 构造函数中只是从缓存中获取数据/定义状态
  //   constructor() {
  //     super()

  //     // 一进来要从缓存中获取有没有token
  //     const str = localStorage.getItem('upload_token')

  //     if (str) {
  //       const res = JSON.parse(str)
  //       this.state = {
  //         expires: res.expires,
  //         uploadToken: res.uploadToken
  //       }
  //     } else {
  //       // 没有内容 undefined，没有存储过
  //       this.state = {
  //         expires: 0,
  //         uploadToken: ''
  //       }
  //     }
  //   }

  //   //   state = {
  //   //     uploadToken: '',
  //   //     expires: 0
  //   //   }

  //   // 存储uploadToken和过期时间的方法
  //   saveUploadToken = (uploadToken, expires) => {
  //     const targetTime = Date.now() + expires * 1000
  //     expires = targetTime
  //     const upload_token = JSON.stringify({ uploadToken, expires })
  //     localStorage.setIem('upload_token', upload_token)
  //     //   3. 存储到state里面
  //     this.setState({
  //       uploadToken,
  //       expires
  //     })
  //   }

  //   // 上传视频之前调用
  //   handleBeforeUpload = (file, fileList) => {
  //     // file就是我们要上传的文件
  //     return new Promise((resolve, reject) => {
  //       // 再上传视频之前要做两件事
  //       // 1. 限制视频大小
  //       if (file.size > MAX_VIDEO_SIZE) {
  //         message.error('视频太大，不能超过20m')
  //         reject('视频太大，不能超过20m')
  //         return
  //       }

  //       if (Date.now() > this.state.expires) {
  //         // 过期了就要重新获取
  //         const { uploadToken, expires } = await reqGetQiniuToken()

  //         // 将数据存储起来
  //         // state里面有最新的数据, 本地缓存中也是有最新的数据
  //         this.saveUploadToken(uploadToken, expires)
  //       }
  //       resolve(file)
  //     })
  //   }


  //   // 真正上传视频时调用, 这个函数会覆盖默认的上传方式
  //   handleCustomRequest = () => {
  //     console.log('上传了')
  //     console.log(this.state.uploadToken)
  //   }
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
