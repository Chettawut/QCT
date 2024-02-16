import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import Footer from "./Footer";

const { Content } = Layout;

function Main({ children }) {

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
  }, [pathname]);

  return (
    <Layout>      
      <Layout>
        <Content className="content-ant" style={{ overflow: "hidden" }}>
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Main;
