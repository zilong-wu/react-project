import React, { Component } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login } from "@redux/actions/login";

import "./index.less";

const { TabPane } = Tabs;

@withRouter
@connect(null, {
  login,
})
class LoginForm extends Component {
  onFinish = ({ username, password }) => {
    this.props.login(username, password).then((token) => {
      // 登录成功
      // console.log("登陆成功~");
      // 持久存储token
      localStorage.setItem("user_token", token);
      this.props.history.replace("/");
    });
    // .catch(error => {
    //   notification.error({
    //     message: "登录失败",
    //     description: error
    //   });
    // });
  };

  validator = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        return reject('必填项')
      }
      if (value.length < 4) {
        return reject('至少四个字')
      }
      if (value.length > 16) {
        return reject('最多16个字')
      }
      if (value.length < 4) {
        return reject('至少四个字')
      }
      if (!/^[a-zA-Z0-9_]+$.text(value)/) {
        return reject('只能写数字，字母，下划线')
      }
      return resolve()
    })
  }

  render () {
    return (
      <>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
        >
          <Tabs
            defaultActiveKey="user"
            tabBarStyle={{ display: "flex", justifyContent: "center" }}
          >
            <TabPane tab="账户密码登陆" key="user">
              <Form.Item name="username" rules={
                [
                  {
                    require: true,
                    message: "必填项"
                  },
                  {
                    min: 4,
                    message: '至少4个字'
                  },
                  {
                    max: 16,
                    message: '最多16个字'
                  },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: '只能是字母，数字，下划线'
                  }
                ]
              }>
                <Input
                  prefix={<UserOutlined className="form-icon" />}
                  placeholder="用户名: admin"
                />
              </Form.Item>
              <Form.Item
                name="password"
                // 规则
                rules={
                  [
                    { validator: this.validator }
                  ]
                }>
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  type="password"
                  placeholder="密码: 111111"
                />
              </Form.Item>
            </TabPane>
            <TabPane tab="手机号登陆" key="phone">
              <Form.Item name="phone">
                <Input
                  prefix={<MobileOutlined className="form-icon" />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Row justify="space-between">
                <Col span={16}>
                  <Form.Item name="verify">
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="验证码"
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Button className="verify-btn">获取验证码</Button>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <Row justify="space-between">
            <Col span={7}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登陆</Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="link">忘记密码</Button>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登陆
            </Button>
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Col span={16}>
                <span>
                  其他登陆方式
                  <GithubOutlined className="login-icon" />
                  <WechatOutlined className="login-icon" />
                  <QqOutlined className="login-icon" />
                </span>
              </Col>
              <Col span={3}>
                <Button type="link">注册</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default LoginForm;
