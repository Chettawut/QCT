import { React } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Typography, Card, Form, Input } from "antd";
import logo4 from "../assets/images/logo_nsf.png";
import Swal from "sweetalert2";
import SystemService from "../service/SystemService";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // alert(values.password, values);
    Connectapp(values);
  };

  const Connectapp = (values) => {
    SystemService.signIn(values)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data?.status === "1") {
            navigate("/dashboard", { replace: true });
          }
        } else {
          Swal.fire({
            title: "<strong>Login ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="layout-default ant-layout layout-sign-up">
        <Header>
          <div className="header-col header-brand">
            <h5>Nine Star Food</h5>
          </div>
        </Header>

        <Content className="p-0">
          <div className="sign-up-header">
            <div className="content">
              <Title>LOGIN</Title>
              <p className="text-lg">
                Enter your username and password to login
              </p>
            </div>
          </div>

          <Card
            className="card-signup header-solid h-full ant-card pt-0"
            // title={<h5>Login</h5>}
            bordered="false"
          >
            <div className="sign-up-gateways ">
              <img
                className="width-20 uploadfile.pb-15"
                src={logo4}
                alt="logo 1"
              />
              <br></br>
              <br></br>
            </div>
            <br></br>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="row-col"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "กรุณากรอก username!" },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "กรุณาใส่รหัสผ่าน!" },
                ]}
              >
                <Input.Password size="small"  placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  LOGIN
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer>
          <p className="copyright">
            {" "}
            <a href="https://www.facebook.com/jaroonsoft">
              Jaroon Software Co., Ltd.
            </a>{" "}
          </p>
        </Footer>
      </div>
    </>
  );
};

export default Login;
