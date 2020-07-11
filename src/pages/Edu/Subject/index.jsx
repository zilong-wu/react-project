import React, { Component } from "react"
// 导入antd中按钮组件
import { Button, Table } from 'antd';
// 导入antd中图标组件
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
// 导入connect
import { connect } from 'react-redux'

// 导入定义的发送请求的方法
// import { reqGetSubjectList } from '@api/edu/subject'
// 导入redux中的异步action
import { getSubjectList } from './redux/index'

import './index.css'

const columns = [
  // columns定义表格的列
  // title属性：表示列名称
  // dataIndex决定这一列展示的是data中哪一项的数据
  { title: '分类名称', dataIndex: 'title', key: 'title' },
  {
    title: '操作',
    dataIndex: '',  // 表示这一列不渲染data里面的数据
    key: 'x',
    // 自定义这一列要渲染的内容
    render: () => <>
      <Button type="primary" className="update-btn"><FormOutlined /></Button>
      <Button type="danger"><DeleteOutlined /></Button>
    </>,
    // 设置这一列的宽度
    width: 200
  },
];
// 导入装饰性语法不能直接默认导出类，得分开写
@connect(
  state => ({ subjectList: state.subjectList }),
  // 为什么已经导入getSubjectList这个action，直接写在下面就好啦，要写在connect里面?
  // 答：这里传入的是一个异步action，但是在展示组件中使用的函数，是通过connnect进行封装之后的，虽然函数名一样，但是并不是同一个函数
  { getSubjectList }
)
class Subject extends Component {
  // 直接给当前组件实例，添加currentPage属性，表示当前是第几页
  currentPage = 1
  // state = {
  //   subject: {} // 用于存储数据
  // }
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

  handleSizeChange = (current, size) => {
    // console.log(current, size);
    // this.getSubjectList(current, size)
    this.props.getSubjectList(current, size)
    // 动态给currentPage赋值，保证当前高亮的页码和实际获取的页码数据保持一致
    this.currentPage = current
  }

  render () {
    // console.log(this.props);
    return (
      <div className="subject">
        <Button type="primary" className="subject-btn"><PlusOutlined />新建</Button>
        <Table
          // 控制列
          columns={columns}
          // 控制可展开项
          expandable={{
            // 可展开项展示内容
            expandedRowRender: record => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            // 控制是否可展开
            rowExpandable: record => record.name !== 'Not Expandable',
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
