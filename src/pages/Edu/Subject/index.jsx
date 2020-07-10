import React, { Component } from "react"
// 导入antd中按钮组件
import { Button, Table } from 'antd';
// 导入antd中图标组件
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'

import './index.css'

const columns = [
  // columns定义表格的列
  // title属性：表示列名称
  // dataIndex决定这一列展示的是data中哪一项的数据
  { title: '分类名称', dataIndex: 'name', key: 'name' },
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

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];

export default class Subject extends Component {
  render () {
    return (
      <div className="subject">
        <Button type="primary" className="subject-btn"><PlusOutlined />新建</Button>
        <Table
          // 控制列
          columns={columns}
          // 控制可展开项
          expandable={{
            // 可展开项展示内容
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            // 控制是否可展开
            rowExpandable: record => record.name !== 'Not Expandable',
          }}
          //表格里面的数据
          dataSource={data}
        />,
      </div>
    )
  }
}
