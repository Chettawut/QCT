import { React, useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Layout, Button, Card, Form, Input,Modal } from "antd";
import logo4 from "../assets/images/logo_nsf.png";

import SystemService from "../service/SystemService";
import { Authenticate } from "../service/Authenticate.service";

const { Header, Footer, Content } = Layout;
const authService = Authenticate();

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [logined, setLogined] = useState(false); 
  
  useEffect( () => {
    const isLogin = () => { 
      const isAuthen = authService.isExpireToken(); 
      if(!!isAuthen) direcetSystem();
      else setLogined(true);
    }

    isLogin();

  }, []);

  const onFinish = (values) => {
    Connectapp(values);
  };
  const direcetSystem = () => { 
    // const curr = authService.getCurrent(); 
    navigate("/dashboard", { replace: true });
  }

  const Connectapp = (values) => {
    SystemService.signIn(values)
      .then((res) => {
        let { status, data } = res;
        const { token } = data; 
        if (status === 200) {
          if (data?.status === "1") {
            authService.setToken(token);

            direcetSystem();
          } else {
            Modal.error({
              title: <strong>{data.message}</strong>,
              content: 'Login request failed...',
            });
              // Swal.fire({
              //   title: "<strong>" + data.message + "</strong>",
              //   html: "ผิดพลาด",
              //   icon: "error",
              // });            
          }
        } else {
          Modal.error({
            title: <strong>Login ผิดพลาด!</strong>,
            content: 'Login request failed...',
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
    {
        logined 
        ? 
      <div className="layout-default ant-layout layout-sign-up">
        <Header>
          <div className="header-col header-brand">
           
          </div>
        </Header>

        <Content className="p-0">
          <div className="sign-up-header">
            <div className="content">
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
                <Input.Password size="small"  placeholder=" Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >LOGIN
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
      : ( <Navigate to="/login" state={{ from: location }} replace /> )
      }
    </>
  );
};

export default Login;
