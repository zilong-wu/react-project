import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// 导入antd
import { Card, Button, Form, Input, Select, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
// 弃用redux：由于要将新的数据与老数据拼接
// import { getSubjectList } from '../../redux'

import { reqGetSubjectList, reqAddSubjectList } from '@api/edu/subject'

// 导入样式
import './index.less'

// 获取Option组件
const Option = Select.Option

//表单布局属性
const layout = {
  // antd把一个宽度分为24份
  // 表单文字描述部分
  labelCol: {
    span: 3
  },
  // 表单项部分
  wrapperCol: {
    span: 6
  }
}

// @connect(state => ({ subjectList: state.subjectList }), null)

class AddSubject extends Component {
  // 用来存储下一次请求页数
  page = 1

  state = {
    subjectList: {
      total: 0,
      items: []
    }
  }
  // 挂在完成发送请求
  async componentDidMount () {
    // this.props.getSubjectList(this.page++, 10)
    const res = await reqGetSubjectList(this.page++, 10)
    // console.log(res)
    this.setState({
      subjectList: res
    })
  }
  // 加载更多：一级课程分类数据
  handleLoadMore = async () => {
    // this.props.getSubjectList(this.page++, 10)
    const res = await reqGetSubjectList(this.page++, 10)
    //获取原来的数据
    // 新数据与老数据拼接
    const newItems = [...this.state.subjectList.items, ...res.items]
    this.setState({
      subjectList: {
        total: res.total,
        items: newItems
      }
    })
  }

  // 点击添加按钮,表单校验成功之后的回调函数
  onFinish = async values => {
    // console.log('Success:', values)
    try {
      // 发送请求新增课程分类
      await reqAddSubjectList(values.subjectname, values.parentid)
      // 提示
      message.success('课程分类添加成功')
      // 跳回到subjectList页面
      this.props.history.push('/edu/subject/list')
    } catch {
      message.error('课程分类添加失败')
    }
  }
  render () {
    return (
      <Card title={
        <>
          <Link to='/edu/subject/list'>
            <ArrowLeftOutlined />
          </Link>
          <span className="add-subject">新增课程</span>
        </>
      }>
        {/* 表单 */}
        <Form
          // 给表单中的表单项布局
          {...layout}
          name='subject'
          // 当点击表单内的提交按钮,onFinish会触发
          onFinish={this.onFinish}
        >
          {/* form表单中每一个表单项都需要使用Form.Item包裹 */}
          <Form.Item
            // 表示提示文字
            label='课程分类名称'
            // 表单项提交时的属性
            name='subjectname'
            // 校验规则
            rules={[
              {
                required: true,
                // 校验不通过时的提示文字
                message: '请输入课程分类!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='父级分类id'
            name='parentid'
            rules={[
              {
                required: true,
                message: '请选择分类id'
              }
            ]}
          >
            <Select
              // 自定义下拉列表中展示内容
              dropdownRender={menu => {
                return <>
                  {menu}
                  {this.state.subjectList.total > this.state.subjectList.items.length ?
                    <Button type="link" onClick={this.handleLoadMore}>加载更多</Button> : null
                  }
                </>
              }}
            >
              {/* 一级课程分类  */}
              <Option value={0} key={0}>{'一级课程分类'}</Option>
              {this.state.subjectList.items.map(subject => {
                return <Option value={subject._id} key={subject._id}>{subject.title}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            {/* htmlType表示这个按钮是表单内的提交按钮 */}
            <Button type='primary' htmlType='submit'>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}
export default AddSubject
