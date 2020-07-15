
import request from '@utils/request'
const BASE_URL = '/admin/edu/lesson'

export function reqGetLessonList (chapterId) {
  return request({
    url: `${BASE_URL}/get/${chapterId}`,
    methods: 'GET'
  })
}


// 新增课时，上传视频，获取七牛云token的方法
export function reqGetQiniuToken () {
  return request({
    url: `/uploadtoken`,
    methods: 'GET'
  })
}