import { COURSE_LIMIT_LEST } from './constant'
import { reqGetCourseLimitList } from '@api/edu/course'

// 同步action
function courseLimitSync (data) {
  return {
    type: COURSE_LIMIT_LEST,
    data
  }
}

// 异步action
export function courseLimit (data) {
  return dispatch => {
    return reqGetCourseLimitList(data).then(res => {
      dispatch(courseLimitSync(data))
      return res
    })
  }
}