// 导入请求API
import {
  reqGetSubjectList,
  reqGetSecSubjectList,
  reqUpdateSubjectList
} from "@api/edu/subject.js";

import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST,
  UPDATE_SUBJECT
} from "./constants";

// 获取一级课程分类同步的action
const getSubjectListSync = list => ({
  type: GET_SUBJECT_LIST,
  data: list,
})
// 获取一级课程分类的action
export const getSubjectList = (page, limit) => {
  return dispatch => {
    return reqGetSubjectList(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response
    })
  }
}

// 获取二级课程分类同步的action
const getSecSubjectListSync = list => ({
  type: GET_SECSUBJECT_LIST,
  data: list,
})
// 获取二级课程分类的action
export const getSecSubjectList = parentId => {
  return dispatch => {
    return reqGetSecSubjectList(parentId).then((response) => {
      // console.log('数据', response)  排除api错误
      dispatch(getSecSubjectListSync(response))
      return response
    })
  }
}

// 更新课程分类同步action
// 不想写return返回
const updataSubjectSync = (data) => ({
  type: UPDATE_SUBJECT,
  data
})
// 更新课程分类action
export const updateSubject = (title, id) => {
  return (dispatch) => {
    // 实现异步操作
    reqUpdateSubjectList(title, id).then(res => {
      // 将redux里面的数据修改完成
      dispatch(updataSubjectSync({ title, id }))
      return res
    })
  }
}
