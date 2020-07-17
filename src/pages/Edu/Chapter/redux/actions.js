import { GET_CHAPTER_LIST, GET_LESSON_LIST, BATCH_DEL_CHAPTER, BATCH_DEL_LESSON } from './constant'
import { reqGetChapterList, reqBatchDelChapter } from '@api/edu/chapter'
import { reqGetLessonList, reqBatchDelLesson } from '@api/edu/lesson'

// 获取章节列表同步的action
function getChapterListSync (data) {
  return {
    type: GET_CHAPTER_LIST,
    data
  }
}
// 获取章节列表异步action
export function getChapterList ({ page, limit, courseId }) {
  return dispatch => {
    return reqGetChapterList({ page, limit, courseId }).then(res => {
      dispatch(getChapterListSync(res))
      return res
    })
  }
}


// 获取课时列表同步action
function getLessonListSync (data) {
  return {
    type: GET_LESSON_LIST,
    data
  }
}
// 获取课时列表异步action
export function getLessonList (chapterId) {
  return dispatch => {
    return reqGetLessonList(chapterId).then(res => {
      dispatch(getLessonListSync(res))
      return res
    })
  }
}

// 批量删除章节同步action
function batchDelChapterSync (data) {
  return {
    type: BATCH_DEL_CHAPTER,
    data
  }
}
// 批量删除章节action
export function batchDelChapter (chapterIds) {
  return disptach => {
    return reqBatchDelChapter(chapterIds).then(res => {
      disptach(batchDelChapterSync(chapterIds))
      return res
    })
  }
}

// 批量删除课时同步action
function batchDelLessonSync (data) {
  return {
    type: BATCH_DEL_LESSON,
    data
  }
}

// 批量删除课时action
export function batchDelLesson (lessonIds) {
  return dispatch => {
    return reqBatchDelLesson(lessonIds).then(res => {
      dispatch(batchDelLessonSync(lessonIds))
      return res
    })
  }
}
