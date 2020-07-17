import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button } from "antd";
import { reqGetAllTeacherList } from '@api/edu/teacher' // 获取全部讲师列表
import { reqAllSubjectList } from '@api/edu/subject'  // 获取所有一级分类课程
import "./index.less";

const { Option } = Select;
// 函数组件
function SearchForm () {
  // antd组件的useEffect
  const [form] = Form.useForm();
  // 定义存储讲师列表的状态
  const [teacherList, setTeacherList] = useState([])
  // 定义存储所有一级课程分类的状态
  const [subjectList, setSubjectList] = useState([])
  // 利用useEffect，实现组件挂载获取数据
  // +[] 是模拟 ComponentDidMount
  // 如果写return模拟 销毁/卸载
  // useEffct不能直接写异步函数，需要包装一下
  useEffect(() => {
    async function fetchData () {
      // 注意：这样的写法，会导致获取完讲师数据，在请求课程分类，会比较耗时间
      // 可使用Promise.all方法
      // const teachers = await reqGetAllTeacherList()
      // const subjectList = await reqAllSubjectList()
      // 等所有请求的数据都响应了之后，会拿到对应的数据
      const [teachers, subjectList] = await Promise.all([reqGetAllTeacherList(), reqAllSubjectList()])

      // console.log(teachers)

      // 把数据存储到teacherList
      setTeacherList(teachers)
      // 把数据存储到subjectList
      setSubjectList(subjectList)
    }
    // 手动调用
    fetchData()
  }, [])

  // const [options, setOptions] = useState([
  //   {
  //     value: "zhejiang",
  //     label: "Zhejiang",
  //     isLeaf: false
  //   },
  //   {
  //     value: "jiangsu",
  //     label: "Jiangsu",
  //     isLeaf: false
  //   }
  // ]);

  // 由于使用了cascarder组件，我们需要将subjectList的数据结构，改成cascader组件要求的数据结构
  const options = subjectList.map(subject => {
    return {
      value: subject._id,
      label: subject.title,
      isLeaf: false,  // false表示有子数据
    }
  })

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const loadData = selectedOptions => {
    // const targetOption = selectedOptions[selectedOptions.length - 1];
    // targetOption.loading = true;

    // // load options lazily
    // setTimeout(() => {
    //   targetOption.loading = false;
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: "dynamic1"
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: "dynamic2"
    //     }
    //   ];
    //   setOptions([...options]);
    // }, 1000);
  };

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item name="title" label="标题">
        <Input placeholder="课程标题" style={{ width: 250, marginRight: 20 }} />
      </Form.Item>
      <Form.Item name="teacherId" label="讲师">
        <Select
          allowClear  // 支持清除
          placeholder="课程讲师"
          style={{ width: 250, marginRight: 20 }}
        >
          {teacherList.map(teacher => (<Option value={teacher._id} key={teacher._id}>{teacher.name}</Option>))}

        </Select>
      </Form.Item>
      <Form.Item name="subject" label="分类">
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={options} // 多级菜单数据
          loadData={loadData} // 用于动态加载选项（点击某个option，触发loadData，可在里面获取下一级数据）
          onChange={onChange} // 选择完成后的回调
          changeOnSelect  // 为true时，点击每级菜单选项值都会触发onChange
          placeholder="课程分类"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          查询
        </Button>
        <Button onClick={resetForm}>重置</Button>
      </Form.Item>
    </Form >
  );
}

export default SearchForm;
