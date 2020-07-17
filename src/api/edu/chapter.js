// 引入axios封装好的API
import request from '@utils/request'
// 基础路径
const BASE_URL = '/admin/edu/chapter'
//获取课程所有的章节
export function reqGetChapterList ({ page, limit, courseId }) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: 'GET',
    params: {
      courseId
    }
  })
}

// 批量删除多个章节
export function reqBatchDelChapter (chapterIds) {
  return request({
    url: `${BASE_URL}/batchRemove`,
    method: 'DELETE',
    data: {
      idList: chapterIds
    }
  })
}
