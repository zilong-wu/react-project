//在index中要将外界需要用的异步action和reducer导出去
import { getChapterList, getLessonList } from './actions'
import chapterList from './reducer'

export { getChapterList, getLessonList, chapterList }
