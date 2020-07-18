import { GET_CHAPTER_LIST, GET_LESSON_LIST, BATCH_DEL_CHAPTER, BATCH_DEL_LESSON } from './constant'
const initChapterList = {
  total: 0,
  items: []
}

export default function chapterList (prevState = initChapterList, action) {
  switch (action.type) {
    case GET_CHAPTER_LIST:
      action.data.items.forEach(item => {
        item.children = []
      })
      return action.data
    case GET_LESSON_LIST:
      // 将课时添加到对应的章节的children中
      // 从返回的数据里面获取chapterId
      // 判断是否有课时
      if (action.data.length > 0) {
        const chapterId = action.data[0].chapterId
        prevState.items.forEach(chapter => {
          if (chapter._id === chapterId) {
            chapter.children = action.data
          }
        })
      }
      return {
        ...prevState
      }
    case BATCH_DEL_CHAPTER:
      // 删除指定的章节数据
      // 1. 需要知道删除哪些 action.data 就是要删除的章节ids（数组）
      const chapterIds = action.data
      // 2. 遍历章节数据，删除在ids中的数据
      const newChapters = prevState.items.filter(chapter => {
        // 如果当前的chapter的id 在 chapterIds中，就删除该条数据，就应该返回false
        if (chapterIds.indexOf(chapter._id) > -1) {
          // 要删除的数中，包含这一条数据
          return false
        }
        return true
      })

      return {
        ...prevState,
        items: newChapters
      }
    case BATCH_DEL_LESSON:
      // 所有课时数据是存储在对应章节的children属性里面的
      // 1. 获取到所有要删除的课时的ids
      const lessonIds = action.data
      // 2. 遍历章节，找到章节之后，遍历章节的课时
      prevState.items.forEach(chapter => {
        // 拿到章节后，要遍历章节的children
        // 遍历children的同时，如果找到要删除的数据就要删除
        const newChildren = chapter.children.filter(lesson => {
          if (lessonIds.indexOf(lesson._id) > -1) {
            return false
          }
          return true
        })
        // 给chapter的children属性重新赋值
        chapter.children = newChildren
      })
      return {
        ...prevState,
        items: prevState.items
      }
    default:
      return prevState
  }
}