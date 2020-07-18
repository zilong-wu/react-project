import { COURSE_LIMIT_LEST } from './constant'
const initCourse = {
  total: 0,
  items: []
}
export function courseList (prevState = initCourse, action) {
  switch (action.type) {
    case COURSE_LIMIT_LEST:
      return action.data
    default:
      return prevState
  }
}