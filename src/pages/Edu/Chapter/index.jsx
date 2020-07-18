import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import {
  FullscreenOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import { connect } from "react-redux";
// 导入知乎提供的视频播放组件
import Player from 'griffith'
// 导入全屏的包
import screenfull from 'screenfull'

import SearchForm from "./SearchForm";
import { getLessonList, batchDelChapter, batchDelLesson } from './redux'
import "./index.less";

dayjs.extend(relativeTime);

@connect(
  (state) => ({
    chapterList: state.chapterList

    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )
  }),
  { getLessonList, batchDelChapter, batchDelLesson }

  // { getcourseList }
)
class Chapter extends Component {
  state = {
    searchLoading: false,
    previewVisible: false,  // 控制Modal窗口是否展示
    selectedRowKeys: [],
    video: ''
  }

  // video就是要预览视频的路径
  showModal = video => () => {
    this.setState({
      previewVisible: true,
      video
    })
  }

  handleModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  componentDidMount () {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    this.getcourseList({ page, limit }).finally(() => {
      this.setState({
        tableLoading: false,
        page,
        limit,
      });
    });
  };

  getcourseList = ({ page, limit, Coursename, nickName }) => {
    return this.props
      .getcourseList({ page, limit, Coursename, nickName })
      .then((total) => {
        if (total === 0) {
          message.warning("暂无用户列表数据");
          return;
        }
        message.success("获取用户列表数据成功");
      });
  };

  onSelectChange = (selectedRowKeys) => {
    // 注意：selectedRowKeys拿到的是选中项的_id
    // 对应哪一行的数据有很多，为什么只拿到_id
    // 因为Table内部其实拿的是每一行数据的rowKey的值，只是我们之前指定了rowKey的值就是_id的值，所有拿到的是每一行数据的_id
    // console.log(selectedRowKeys)
    this.setState({
      selectedRowKeys,
    });
  };

  //点击跳转到添加课时页面
  handleGoAddLesson = data => () => {
    this.props.history.push('/edu/chapter/addlesson', data)
  }
  // 点击课时展开按钮
  handleClickExpand = (expand, record) => {
    // console.log(expand)
    if (expand) {
      // 发送请求获取数据
      this.props.getLessonList(record._id)
    }
  }
  // 点击批量删除
  handleBatchDel = () => {
    Modal.confirm({
      title: '确定要删除选中的吗？',
      onOk: async () => {
        // selectedRowKeys里面存储所有的选中的课时/章节
        // 所有在批量删除时，需要分清哪些是课程id，哪些是章节id
        let chapterIds = [] // 存储选中章节id
        let lessonIds = []  // 存储选中课时id
        // 1. 获取所有的选中id
        const selectedRowKeys = this.state.selectedRowKeys
        // 2. 筛选章节id剩下的就是 课时id
        // 所有的章节数据，都存储在redux里面，拿到章节数据，然后遍历章节数据，判断selectedRowKeys哪些是章节的id取出来
        const chapterList = this.props.chapterList.items
        // 遍历查找章节id
        chapterList.forEach(chapter => {
          // 找到每-条章节的id
          let chapterId = chapter._id
          // 如果selectedRowKeys里面有chapterId，就返回这个id对应的下标，否则则返回-1
          let index = selectedRowKeys.indexOf(chapterId)
          if (index > -1) {
            // 证明找到了，就从selectedRowKeys把这条数据切出来
            // splice会修改原来数组，并且返回切割的新数组
            chapterIds = [...selectedRowKeys.splice(index, 1), ...chapterIds]
          }
        })
        lessonIds = [...selectedRowKeys]
        // console.log(chapterIds);
        // console.log(selectedRowKeys);

        // 定义异步接口，定义redux里面
        await this.props.batchDelChapter(chapterIds)
        await this.props.batchDelLesson(lessonIds)
        message.success('批量删除成功')
      }
    })
  }

  // 让整个页面全屏
  handleScreenFull = () => {
    // screenfull.request()
    screenfull.toggle()
  }


  render () {
    const { previewVisible, selectedRowKeys } = this.state;

    const columns = [
      {
        title: "章节名称",
        dataIndex: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        // 注意：如果没有写dataIndex,render函数接收到这一行的数据
        // 如果写了，render函数接收这一数据中对应datatIndex中那个属性的值
        render: isFree => {
          // console.log(isFree)
          // 这行代码实现 章节不显示是否免费，只有课时才显示
          return isFree === true ? "是" : isFree === false ? "否" : "";
        },
      },
      {
        title: '视频',
        // 逻辑：如果是章节则不展示任何内容
        // 如果是课时，则判断是否免费，是则显示预览按钮
        render: (value) => {
          // console.log(value)
          if (!value.free) return
          return <Button onClick={this.showModal(value.video)}>预览</Button>
        }
      },
      {
        title: "操作",
        width: 300,
        fixed: "right",
        render: data => {
          // if ("free" in data) {
          return (
            <div>
              {data.free === undefined && (<Tooltip title="新增课时">
                <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoAddLesson(data)}>
                  <PlusOutlined />
                </Button>
              </Tooltip>)}
              <Tooltip title={data.free === undefined ? "更新章节" : "更新课时"}>
                <Button type="primary">
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title={data.free === undefined ? "删除章节" : "删除课时"}>
                <Button type="danger" style={{ marginLeft: "10px" }}>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </div>
          );
          // }
        },
      },
    ]

    // 定义视频源， 放在render里面 当状态数据变化会执行render。 如果不放在render则是创建的时候执行一次。
    // 这个sources的路径 需要改变 so放在render里面
    const sources = {
      // 高清     sd：标清
      hd: {
        // 视频地址
        play_url: this.state.video,
        // 视频属性：乱写的  由于这个包把这些属性定义为必须的，不写则报警告
        bitrate: 1,
        duration: 1000,
        format: '',
        height: 500,
        size: 160000,
        width: 500
      }
    }

    // 为什么把onChange这个方法卸载rowSelection，因为在Table比较复杂，未来我们在写onChange的时候可能会有很多个，所有他用了不一样的语法，把选中对象的onChange放在选中对象中
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      //#region 
      // hideDefaultSelections: true,
      // selections: [
      //   Table.SELECTION_ALL,
      //   Table.SELECTION_INVERT,
      //   {
      //     key: "odd",
      //     text: "Select Odd Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return false;
      //         }
      //         return true;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   },
      //   {
      //     key: "even",
      //     text: "Select Even Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return true;
      //         }
      //         return false;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   }
      // ]
      //#endregion
    }

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>
        <div className="course-table">
          <div className="course-table-header">
            <h3>课程章节列表</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新增</span>
              </Button>
              <Button
                type="danger"
                style={{ marginRight: 10 }}
                onClick={this.handleBatchDel}
              >
                <span>批量删除</span>
              </Button>
              <Tooltip title="全屏" className="course-table-btn" onClick={this.handleScreenFull}>
                <FullscreenOutlined />
              </Tooltip>
              <Tooltip title="刷新" className="course-table-btn">
                <RedoOutlined />
              </Tooltip>
              <Tooltip title="设置" className="course-table-btn">
                <SettingOutlined />
              </Tooltip>
            </div>
          </div>
          <Alert
            message={
              <span>
                <InfoCircleOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {`已选择 ${selectedRowKeys.length} 项`}
              </span>
            }
            type="info"
            style={{ marginBottom: 20 }}
          />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.chapterList.items}
            rowKey="_id"
            // 点击展开按钮
            expandable={{
              onExpand: this.handleClickExpand
            }}
          />
        </div>
        {/* ant-desgin对话框组件, 预览功能在其实现 */}
        <Modal
          title='视频'
          visible={previewVisible}
          // 点击Modal的关闭按钮（右上角的X），触发
          onCancel={this.handleModal}
          footer={null}
          destroyOnClose={true} //关闭modal销毁modal子元素
        >
          <Player
            sources={sources}   // 必须有，定于预览视频的路径，多个视频源
            id={'1'}
            cover={'http://localhost:3000/logo512.png'}   // 视频封面
            duration={1000}
          ></Player>
        </Modal>
      </div>
    );
  }
}

export default Chapter
