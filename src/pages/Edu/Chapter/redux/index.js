// 在index中要将外界需要用的异步action和reducer导出
import { getChapterList, getLessonList, batchDelChapter, batchDelLesson } from './actions'

import chapterList from './reducer'

export { getChapterList, getLessonList, batchDelChapter, batchDelLesson, chapterList }