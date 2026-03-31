import React from "react";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
  const onFinish = (values) => {
    if (values.username === "hien" && values.password === "hien@123") {
        navigate("/");
        toast.success("Login successful!");
        localStorage.setItem("token", JSON.stringify({ username: values.username, token: Math.random().toString(36).substr(2, 9)}))
        return;
    }
    
    toast.error("Wrong account or password ❌");
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3} className="text-center">
          Login
        </Title>
        <Text type="secondary" className="sub-text">
          Welcome to AI 👋
        </Text>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="password"
              size="large"
            />
          </Form.Item>

          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="login-btn"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="register-text">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </Card>
    </div>
  );
};

export default Login;