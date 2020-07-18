import request from "@utils/request";
// 请求路径不写主机名，会将这个路径与package.json中配置的代理proxy的主机名进行拼接
const BASE_URL = "/admin/edu/course";

// 获取所有课程列表
export function reqGetCourseList () {
  // request返回一个promise
  return request({
    url: `${BASE_URL}`,
    method: "GET"
  })
}

// 获取课程分页列表
export function reqGetCourseLimitList ({ page, limit, teacherId, subjectId, subjectParentId, title }) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: 'GET',
    params: {
      page, limit, teacherId, subjectId, subjectParentId, title
    }
  })
}

