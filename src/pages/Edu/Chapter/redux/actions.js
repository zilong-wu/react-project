import { GET_CHAPTER_LIST } from './constant'
import { reqGetChapterList } from '@api/edu/chapter'

// 获取章节列表同步的action
function getChapterListSync (data) {
  return {
    type: GET_CHAPTER_LIST,
    data
  }
}

// 获取章节列表异步action
export function getChapterList () {
  return dispatch => {
    return reqGetChapterList({ page, limit, courseId }).then(res => {
      dispatch(getChapterListSync(res))
      return res
    })
  }
}