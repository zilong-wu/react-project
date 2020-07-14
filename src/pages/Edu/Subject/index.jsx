import React, { Component } from "react"
// 导入antd中按钮组件
import { Button, Table, Tooltip, Input, message } from 'antd';
// 导入antd中图标组件
import { PlusOutlined, FormOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
// 导入connect
import { connect } from 'react-redux'

// 导入定义的发送请求的方法
// import { reqGetSubjectList } from '@api/edu/subject'
// 导入redux中的异步action
import { getSubjectList, getSecSubjectList, updateSubject } from './redux'
// 导入删除课程分类数据的方法
import { reqDelSubject } from '@api/edu/subject'

import './index.css'

// 导入装饰性语法不能直接默认导出类，得分开写
@connect(
  state => ({ subjectList: state.subjectList }),
  // 为什么已经导入getSubjectList这个action，直接写在下面就好啦，要写在connect里面?
  // 答：这里传入的是一个异步action，但是在展示组件中使用的函数，是通过connnect进行封装之后的，虽然函数名一样，但是并不是同一个函数
  { getSubjectList, getSecSubjectList, updateSubject }
)
class Subject extends Component {
  // 直接给当前组件实例，添加currentPage属性，表示当前是第几页
  currentPage = 1
  // 控制是否显示
  state = {
    // subjectId作用：
    // 1. 如果subjectId没有，表示表格某一行直接展示课程分类的title
    // 如果有值(应该就是要修改数据的id)，展示input
    // 2. 修改数据需要用到subjectId
    subjectId: '', // 用于存储数据
    subjectTitle: ''  // 用于设置受控组件
  }

  componentDidMount () {
    // 一打开页面就发送请求
    // this.getSubjectList(1, 10)
    this.props.getSubjectList(1, 10)
  }
  // 封装发送请求
  // getSubjectList = async (current, size) => {
  //   const res = await reqGetSubjectList(current, size)
  //   console.log(res)
  //   // this
  //   this.setState({
  //     subject: res
  //   })
  // }

  // 点击页码，获取对应页的数据
  handlePageChange = (page, pagesize) => {
    // this.getSubjectList(page, pagesize)
    this.props.getSubjectList(page, pagesize)
    // 动态给currentPage赋值，保证当前高亮的页码和实际获取的页码数据保持一致
    this.currentPage = page
  }
  // 一页展示几条数据变化时触发回调函数
  handleSizeChange = (current, size) => {
    // console.log(current, size);
    // this.getSubjectList(current, size)
    this.props.getSubjectList(current, size)
    // 动态给currentPage赋值，保证当前高亮的页码和实际获取的页码数据保持一致
    this.currentPage = current
  }
  // 点击跳转到添加课程分类
  handleGoAddSubject = () => {
    // 注意： 新增是在教学模块下面，所以路由前面要加edu
    // console.log(this.props.history);
    this.props.history.push('/edu/subject/add')
  }

  // 点击可展开二级菜单数据
  // expanded: true表示展开了, false表示关闭了
  // record: 就是对应的这一行的数据
  handleClickExpand = (expanded, record) => {
    // console.log(expanded, record)
    // console.log(this.props);
    //判断如果是展开就请求二级菜单数据,关闭就什么都不做
    if (expanded) {
      // 请求二级菜单数据
      // 需要传入parentId
      this.props.getSecSubjectList(record._id)
    }
  }

  // 更新数据需求
  // 点击更新按钮
  handleUpdateClick = (value) => {
    return () => {
      // 修改subjectId
      // console.log(value)
      this.setState({
        subjectId: value._id,
        subjectTitle: value.title
      })
    }
  }
  // 修改title受控组件的onChange事件处理函数
  handleTitleChange = (e) => {
    this.setState({
      subjectTitle: e.target.value
    })
  }
  // 显示input框，点击取消
  handleCancle = () => {
    this.setState({
      subjectId: '',
      subjectTitle: ''
    })
  }
  // 显示input框，点击确认
  handleUpdate = () => {
    let { subjectId, subjectTitle } = this.state
    this.props.updateSubject(subjectTitle, subjectId)
    message.success('更改成功')
    // 手动调用取消按钮的事件处理函数，让表格展现内容
    this.handleCancle()
  }

  // 点击删除数据
  // handleDel = (value) => {
  //   confirm({
  //     title: (
  //       <>
  //       </>
  //     ),
  //     icon: <ExclamationCircleOutlined />,
  //     onOk: () => {
  //       真正去删除这条数据
  //       reqDelSubject(value._id)
  //     }
  //   })
  // }

  render () {
    // 组件外部不能用到组件里面的东西，所以得写在组件里面
    // 注意：这个colmns写在render中，因为state变化，render会调用，这个columns才会重新执行
    const columns = [
      // columns定义表格的列
      // title属性：表示列名称
      // dataIndex决定这一列展示的是data中哪一项的数据
      {
        title: '分类名称',
        // dataIndex: 'title',
        key: 'title',
        render: (value) => {
          // 如果state里面存储的id和这一条数据的id相同，则展示input
          // 由于第一页数据有10条，所以这个render的回调会执行10次
          // 接收的value是对应每一行数据
          if (this.state.subjectId === value._id) {
            return <Input
              className="subject-input"
              value={this.state.subjectTitle}
              onChange={this.handleTitleChange}
            />
          }
          return <span>{value.title}</span>
        }
      },
      {
        title: '操作',
        dataIndex: '',  // 表示这一列不渲染data里面的数据
        key: 'x',
        // 自定义这一列要渲染的内容
        render: (value) => {
          // 判断当前数据的id是否与state里面的subjectId的值相同，相同则展示确认取消，否则展示修改删除
          if (this.state.subjectId === value._id) {
            return <>
              <Button type="primary" className="update-btn" onClick={this.handleUpdate}>确认</Button>
              <Button type="danger" onClick={this.handleCancle}>取消</Button>
            </>
          }
          return <>
            <Tooltip title="更新课程分类">
              <Button type="primary" className="update-btn" onClick={this.handleUpdateClick(value)}><FormOutlined /></Button>
            </Tooltip>
            <Tooltip title="删除课程分类">
              <Button type="danger" onClick='this.handleDel'><DeleteOutlined /></Button>
            </Tooltip>
          </>
        },
        // 设置这一列的宽度
        width: 200
      },
    ]
    return (
      <div className="subject">
        <Button type="primary" className="subject-btn" onClick={this.handleGoAddSubject}><PlusOutlined />新建</Button>
        <Table
          // 控制列
          columns={columns}
          // 控制可展开项
          expandable={{
            // 可展开项展示内容
            // 注意: 使用这个属性会把二级菜单数据, 渲染到一级菜单的位置上
            // 所以不使用这个
            // expandedRowRender: record => (
            //   <p style={{ margin: 0 }}>{record.description}</p>
            // ),
            // // 控制是否可展开
            // rowExpandable: record => record.name !== 'Not Expandable',

            //当点击可展开按钮,触发的事件处理函数
            onExpand: this.handleClickExpand
          }}
          //表格里面的数据
          // dataSource={this.state.subject.items}
          dataSource={this.props.subjectList.items}
          // 告诉Table组件，使用数据中_id作为key的值
          rowKey='_id'
          pagination={{
            // total: this.state.subject.total, //total表示数据总数
            total: this.props.subjectList.total, //total表示数据总数
            showQuickJumper: true, //是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数据数量
            pageSizeOptions: ['5', '10', '15', '20'], //设置每次显示数据数量的配置项
            // defaultPageSize: 10, //每页默认显示数据条数 默认是10,
            // 
            onChange: this.handlePageChange,
            // 
            onShowSizeChange: this.handleSizeChange,
            // 控制分页组件第几页高亮
            current: this.currentPage
          }}
        />,
      </div>
    )
  }
}

export default Subject
