import { Card, Form, Input, Button, Checkbox, message } from "antd";
import logo from "./../../assets/logo.png";
import "./index.scss";
import { useStore } from "@/store";

import { useNavigate } from "react-router-dom";

function Login() {
  // 获取跳转实例对象
  const navigate = useNavigate();
  const { loginStore } = useStore();
  // 点击登录按钮时触发 参数values即是表单输入数据
  async function onFinish(values) {
    //console.log(values);
    if (!values.remember) {
      message.warning("请勾选用户协议");
      return;
    }
    // values：放置的是所有表单项中用户输入的内容
    // todo:登录
    const { mobile, code } = values;
    await loginStore.getToken({ mobile, code });
    // 跳转首页
    navigate("/", { replace: true });
    // 提示用户
    //message.success("登录成功");
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          validateTrigger={["onBlur", "onChange"]}
          onFinish={onFinish}
          initialValues={{
            mobile: "13911111111",
            code: "246810",
            remember: true,
          }}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "手机号码格式不对",
                validateTrigger: "onBlur",
              },
              { required: true, message: "请输入手机号" },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              { len: 6, message: "验证码6个字符", validateTrigger: "onBlur" },
              { required: true, message: "请输入验证码" },
            ]}
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
