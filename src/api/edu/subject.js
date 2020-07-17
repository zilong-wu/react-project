// 跟课程分类相关的所有请求方法都放在这里

import request from "@utils/request";
// 请求路径不写主机名，会将这个路径与package.json中配置的代理proxy的主机名进行拼接
const BASE_URL = "/admin/edu/subject";
// 现在要从mock上面获取数据，所以重新定义一个请求mock的路径
// 这里有主机名，就不会和proxy拼接了
// const MOCK_URL = `http://localhost:8888${BASE_URL}`

// 获取一级课程分类
export function reqGetSubjectList (page, limit) {
  // request返回一个promise
  return request({
    // url: `${MOCK_URL}/${page}/${limit}`,
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  })
}

// 获取二级课程分类
export function reqGetSecSubjectList (parentId) {
  // request返回一个promise
  return request({
    // admin/edu/subject/get/:parentId
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET"
  })
}

// 添加课程分类
export function reqAddSubjectList (title, parentId) {
  // console.log(title, parentId)
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data: {
      title,
      parentId
    }
  })
}

// 获取更新课程分类
// /admin/edu/subject/update
export function reqUpdateSubjectList (title, id) {
  return request({
    url: `${BASE_URL}/update`,
    method: 'PUT',
    data: {
      title,
      id
    }
  })
}

// 删除课程分类管理title的数据
export function reqDelSubject (id) {
  return request({
    url: `${BASE_URL}/remove/${id}`,
    method: 'DELETE'
  })
}

// 获取所有的一级课程分类数据
export function reqAllSubjectList () {
  return request({
    url: `${BASE_URL}`,
    method: 'GET'
  })
}