import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button } from "antd";
import { reqGetAllTeacherList } from '@api/edu/teacher' // 获取全部讲师列表
import { reqAllSubjectList, reqGetSecSubjectList } from '@api/edu/subject'  // 获取所有一级/二级分类课程
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

      // 由于使用了cascarder组件，我们需要将subjectList的数据结构，改成cascader组件要求的数据结构
      const options = subjectList.map(subject => {
        return {
          value: subject._id,
          label: subject.title,
          isLeaf: false   // false表示有子数据
        }
      })
      // 把数据存储到subjectList
      setSubjectList(options)
      // 把数据存储到teacherList
      setTeacherList(teachers)
    }
    // 手动调用
    fetchData()
  }, [])

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  //#region 
  // 分析loadData
  // const loadData = selectedOptions => {
  //   // console.log('多级下拉', selectedOptions);
  //   // loadData 点击一级或其他子级的时候会触发
  //   // selectedOptions 是一个数组
  //   // 如果点击一级菜单 selectedOptions存储的就是一个值，就是对应一级菜单数据
  //   // 如果点击二级菜单 selectedOptions存储的就是2个值，第一个值一级菜单数据，第二个值就是二级菜单，以此类推
  //   // 如果点击二级菜单，意味着要获取的是三级菜单数据，就需要拿二级菜单数据，根据二级菜单获取三级菜单，所以 每次获取selectedOptions中最后一条数据
  //   const targetOption = selectedOptions[selectedOptions.length - 1]

  //   // Cascader组件底层实现了正在加载
  //   targetOption.loading = true;  // 显示小圆圈

  //   // 未来要真正发送异步请求获取二级分类列表数据
  //   // const secSubject = await reqGetSecSubjectList()
  //   // 小圆圈消失
  //   targetOption.loading = false;

  //   // 给当前级数的菜单添加子级数据
  //   targetOption.children = [
  //     {
  //       label: `${targetOption.label} Dynamic 1`,
  //       value: "dynamic1",
  //       // 如果子级数据后面还有子级数据，就加上isLeaf
  //       isLeaf: false
  //     },
  //     {
  //       label: `${targetOption.label} Dynamic 2`,
  //       value: "dynamic2",
  //       isLeaf: false
  //     }
  //   ];
  //   // 修改targetOption实际就是修改subjectList里面的数据，所以直接调用setSubjectList让数据更新，视图重新渲染
  //   setSubjectList([...subjectList]);

  // }
  //#endregion

  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1]

    targetOption.loading = true;  // 显示小圆圈

    // 异步请求 获取二级分类列表数据
    let secSubject = await reqGetSecSubjectList(targetOption.value)

    // 如果一级菜单下面没有二级数据，那么就不需要给一级数据的children属性赋值了


    // 由于Cascader组件，对渲染的数据有格式要求，所以必须将二级分类数据，进行重构
    secSubject = secSubject.items.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
    // 小圆圈消失
    targetOption.loading = false;

    // 如果一级菜单数据没有二级数据，那么点击一级，每一次会去请求二级，就不能被选中了
    // 如果要选中，就要在获取二级数据之后，判断是否有二级数据，有就添加children属性，没有就给一级数据的isLeaf赋值为true


    // 给当前级数的菜单添加子级数据
    if (secSubject.length) {
      targetOption.children = secSubject
    } else {
      targetOption.isLeaf = true
    }


    setSubjectList([...subjectList]);

  }

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
          options={subjectList} // 多级菜单数据
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
